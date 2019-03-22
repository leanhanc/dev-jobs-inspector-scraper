const puppeteer = require('puppeteer');
const logger = require('../services/logger');
const advert = require('../controllers/AdvertsController');
const { LAUNCH_OPTIONS } = require('./config/constants/');

module.exports = class Scraper {
  constructor() {}

  async init(url) {
    this.page = await this.launch();
    await this.page.goto(url);
  }

  async launch() {
    this.browser = await puppeteer.launch({ ...LAUNCH_OPTIONS });

    const page = await this.browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
    );

    await page.setRequestInterception(true);

    page.on('request', request => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    return page;
  }

  async saveAdverts(adverts) {
    advert()
      .save(adverts)
      .catch(e => logger.error(e.message));
  }
};
