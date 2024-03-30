const { getNormalURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("getNormalURL strip protocol", () => {
  const input = "https://blog.ali.net/path";
  const actual = getNormalURL(input);
  const expected = "blog.ali.net/path";
  expect(actual).toEqual(expected);
});

test("getNormalURL trailing slash", () => {
  const input = "https://blog.ali.net/path/";
  const actual = getNormalURL(input);
  const expected = "blog.ali.net/path";
  expect(actual).toEqual(expected);
});

test("getNormalURL capitals", () => {
  const input = "https://BLOG.ali.net/path/";
  const actual = getNormalURL(input);
  const expected = "blog.ali.net/path";
  expect(actual).toEqual(expected);
});

test("getNormalURL strip http instead of https", () => {
  const input = "http://blog.ali.net/path/";
  const actual = getNormalURL(input);
  const expected = "blog.ali.net/path";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute", () => {
  const input = `
    <html>
      <body>
        <a href="https://crawler.ali.net/path/">
              crawler blog 
        </a>
      </body>
    </html>
`;
  const baseURL = "https://crawler.ali.net/path";
  const actual = getURLsFromHTML(input, baseURL);
  const expected = ["https://crawler.ali.net/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const input = `
    <html>
      <body>
        <a href="/path/">
              crawler blog 
        </a>
      </body>
    </html>
`;
  const baseURL = "https://crawler.ali.net";
  const actual = getURLsFromHTML(input, baseURL);
  const expected = ["https://crawler.ali.net/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
  const input = `
    <html>
      <body>
        <a href="https://crawler.ali.net/firstPath/">
              first crawler blog  path  
        </a>
        <a href="/secondPath/">
              second crawler blog path 
        </a>
      </body>
    </html>
`;
  const baseURL = "https://crawler.ali.net";
  const actual = getURLsFromHTML(input, baseURL);
  const expected = [
    "https://crawler.ali.net/firstPath/",
    "https://crawler.ali.net/secondPath/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
  const input = `
    <html>
      <body>
        <a href="invalid">
              first crawler blog  path  
        </a>
      </body>
    </html>
`;
  const baseURL = "https://crawler.ali.net";
  const actual = getURLsFromHTML(input, baseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
