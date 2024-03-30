const { crawlPage } = require("./crawl.js");

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
  const pages = await crawlPage(baseURL, baseURL, {});
  for (const page of Object.entries(pages)) {
    console.log(page);
  }
};

main();
