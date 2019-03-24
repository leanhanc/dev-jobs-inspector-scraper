const ZonajobsScraper = require('./zonajobsScraper');
const { BUMERAN_URL: baseUrl } = require('../scraper/config/constants');

const siteName = 'Bumeran';

module.exports = class Bumeran extends ZonajobsScraper {
  constructor(searchFor) {
    super();
    this.baseUrl = baseUrl;
    this.searchFor = searchFor;
  }
  async getAdvertDetails(advertDetailPage) {
    return await advertDetailPage.evaluate(siteName => {
      const composeAdvert = {};

      composeAdvert.description = [].map
        .call(document.querySelectorAll('.aviso_description > p'), el => el.innerText)
        .join();
      composeAdvert.location =
        document.querySelector('.spec_def h2 a').innerText.split(',')[0] === 'Capital Federal'
          ? document.querySelector('.spec_def h2 a').innerText.split(',')[0]
          : document.querySelector('.spec_def h2 a').innerText.split(',')[1];
      composeAdvert.publisher = document.querySelector('.aviso_company').innerText;
      composeAdvert.site = siteName;
      composeAdvert.title = document.querySelector('.aviso_title').innerText;
      composeAdvert.url = window.location.href;

      return composeAdvert;
    }, siteName);
  }

  async scraper() {
    await this.init(this.baseUrl);
    await this.iterateOverSearchTerms();
  }
};
