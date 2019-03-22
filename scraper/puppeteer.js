const { LAUNCH_OPTIONS } = require('./config/constants/');
const puppeteer = require('puppeteer');

// Agregar método a Puppeteer con la configuración necesaria
puppeteer.start = async () => {
  const browser = await puppeteer.launch({ ...LAUNCH_OPTIONS });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0'
  );

  await page.setRequestInterception(true);

  page.on('request', request => {
    if (['image', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return page;
};

module.exports = puppeteer;
