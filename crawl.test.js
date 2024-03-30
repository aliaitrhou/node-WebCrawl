const { getNormalURL } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("getNormalURL strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = getNormalURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getNormalURL trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = getNormalURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getNormalURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = getNormalURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getNormalURL strip http instead of https", () => {
  const input = "http://blog.boot.dev/path/";
  const actual = getNormalURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});
