const puppeteer = require('puppeteer');

const MAX_RESULT_LENGTH = 10;

const scrapeResults = async (page) => {
  const searchResults = await page.$$eval('div[id=rso]', (results) => {
    let data = [];
    results.forEach((parent) => {
      const ele = parent.querySelector('h2');
      if (ele === null) {
        return;
      }
      let gCount = parent.querySelectorAll('div[class=g]');
      if (gCount.length === 0) {
        gCount = parent.querySelectorAll('div[class=srg] > div[class=g]');
      }
      gCount.forEach((result, index) => {
        const url = result.querySelector('div[class=rc] > div[class=r] > a')
          .href;
        data.push({ url });
      });
    });
    return data;
  });

  return searchResults;
};

const searchGoogle = async (keywords) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ],
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('https://google.com');

  await page.type('input[name="q"]', keywords);

  await page.$eval('input[name=btnK]', (button) => button.click());

  let searchResults = [];

  while (searchResults.length <= MAX_RESULT_LENGTH) {
    await page.waitForSelector('div[id=search]');
    searchResults = [...searchResults, ...(await scrapeResults(page))];
    try {
      await page.$eval('a[id=pnnext]', (button) => button.click());
    } catch (error) {
      break;
    }
  }

  await browser.close();

  return searchResults
    .slice(0, MAX_RESULT_LENGTH)
    .map((item, index) => ({ index, ...item }));
};

module.exports = searchGoogle;
