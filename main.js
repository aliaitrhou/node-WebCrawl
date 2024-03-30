const { crawler } = require("./crawl.js");

const main = async () => {
  if (process.argv.length < 3) {
    console.log("not website provided");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many commend lines");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(`start crawling of ${baseURL}`);
  const pages = await crawler(baseURL, baseURL, {});
  printReport(pages);
};
main();

function printReport(pages) {
  console.log("<---------------REPORT---------------->");
  const sortedPages = sortPages(pages);
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const count = sortedPage[1];
    console.log(`Found ${count} internal links to ${url}`);
  }
}
function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((pageA, pageB) => {
    return pageB[1] - pageA[1];
  });
  return pagesArr;
}
