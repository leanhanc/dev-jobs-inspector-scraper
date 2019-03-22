const Scraper = require('./Scraper');
const { ZONAJOBS_URL: baseUrl } = require('../scraper/config/constants');

const filterAdvertsByWord = 'horas';

module.exports = class Zonajobs extends Scraper {
  constructor(searchFor) {
    super();
    this.baseUrl = baseUrl;
    this.filterAdvertsByWord = filterAdvertsByWord;
    this.searchFor = searchFor;
  }

  async sortByDate() {
    const buttonSelector = '.btn.switch-btn';
    await this.page.waitForSelector(buttonSelector);
    const button = await this.page.$$(buttonSelector);
    await button[1].click();
    await this.page.waitFor(1000);
  }

  async getAdvertsUrl() {
    const advertsUrl = await this.page.evaluate(filterAdvertsByWord => {
      const filteredAdverts = [];

      document.querySelectorAll('.aviso').forEach(advert => {
        if (advert.querySelector('.z-fecha').textContent.includes(filterAdvertsByWord)) {
          filteredAdverts.push(advert.querySelector('a').href);
        }
      }, filterAdvertsByWord);

      return filteredAdverts;
    }, filterAdvertsByWord);

    return advertsUrl;
  }

  async getAdvertDetails(advertDetailPage) {
    return await advertDetailPage.evaluate(() => {
      const composeAdvert = {};

      composeAdvert.description = [].map
        .call(document.querySelectorAll('.aviso_description > p'), el => el.innerText)
        .join();
      composeAdvert.location =
        document.querySelector('.spec_def h2 a').innerText.split(',')[0] === 'Capital Federal'
          ? document.querySelector('.spec_def h2 a').innerText.split(',')[0]
          : document.querySelector('.spec_def h2 a').innerText.split(',')[1];
      composeAdvert.publisher = document.querySelector('.aviso_company').innerText;
      composeAdvert.site = 'Zonajobs';
      composeAdvert.title = document.querySelector('.aviso_title').innerText;
      composeAdvert.url = window.location.href;

      return composeAdvert;
    });
  }

  async iterateOverAdvertsUrl(advertsUrl) {
    advertsUrl.forEach(async advertUrl => {
      const advertDetailPage = await this.browser.newPage();
      await advertDetailPage.goto(advertUrl);
      await advertDetailPage.waitFor(2000);

      const adverts = await this.getAdvertDetails(advertDetailPage);
      await super.saveAdverts(adverts);

      await advertDetailPage.waitFor(1000);
      await advertDetailPage.close();
    });
  }

  async iterateOverSearchTerms() {
    for (let term of this.searchFor) {
      await this.page.waitForSelector('#query');
      await this.page.type('#query', term, { delay: 200 });
      await this.page.keyboard.press('Enter');
      await this.page.waitFor(1000);

      await this.sortByDate();

      await this.page.waitFor(2000);
      const advertsUrl = await this.getAdvertsUrl();
      await this.iterateOverAdvertsUrl(advertsUrl);
    }
    await this.browser.close();
  }

  async scraper() {
    await super.init(this.baseUrl);
    await this.iterateOverSearchTerms();
  }
};
