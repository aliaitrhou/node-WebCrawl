const { JSDOM } = require("jsdom"); // use this lib to convert the html string to real document object modele
// so we can grap the a tag and accses the href

async function crawler(baseURL, currentURL, pages) {
  // if this is an offsite URL, stop crawling immediately
  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);
  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }

  const regularUrl = getNormalURL(currentURL);
  // if we have already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[regularUrl] > 0) {
    pages[regularUrl]++;
    return pages;
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[regularUrl] = 1;

  // fetch and parse the html of the currentURL
  console.log(`crawling ${currentURL}`);
  let htmlBody = "";
  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      console.log(`error was found in the http, status code: ${resp.status}`);
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`invalid data type response: ${contentType}`);
      return pages;
    }
    htmlBody = await resp.text();
  } catch (err) {
    console.log(err.message);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawler(baseURL, nextURL, pages);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  // creat a document object modele
  const dom = new JSDOM(htmlBody);
  const linksArr = dom.window.document.querySelectorAll("a");
  for (const link of linksArr) {
    if (link.href.slice(0, 1) === "/") {
      // relative
      try {
        const validUrl = new URL(`${baseURL}${link.href}`);
        urls.push(validUrl.href);
      } catch (err) {
        console.log(`not a valid url (relative), ${err.message}`);
      }
    } else {
      // absolute
      try {
        const validUrl = new URL(link.href);
        urls.push(validUrl.href);
      } catch (err) {
        console.log(`not a valid url (absolute), ${err.message}`);
      }
    }
  }
  return urls;
}

function getNormalURL(urlStr) {
  const url = new URL(urlStr);
  const host = `${url.hostname}${url.pathname}`;
  if (host.length > 0 && host.slice(-1) === "/") {
    return host.slice(0, -1);
  }
  return host;
}

module.exports = {
  getNormalURL,
  getURLsFromHTML,
  crawler,
};
