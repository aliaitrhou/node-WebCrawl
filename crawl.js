const { JSDOM } = require("jsdom"); // use this lib to convert the html string to real document object modele
// so we can grap the a tag and accses the href

async function crawlPage(currentUrl) {
  console.log(`actively crawling: ${currentUrl}`);
  try {
    const resp = await fetch(currentUrl);
    if (resp.status > 399) {
      console.log(
        `error in fetch with status code: ${resp.status}, on page : ${currentUrl}`,
      );
      return;
    }
    const typeOfContent = resp.headers.get("content-type");
    if (!typeOfContent.includes("text/html")) {
      console.log(
        `non html response, content type: ${typeOfContent}, on page ${currentUrl}`,
      );
      return;
    }
    console.log(await resp.text());
  } catch (err) {
    console.log(
      "we have a problem which is :" + err.message + "and " + err.status,
    );
  }
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
  crawlPage,
};
