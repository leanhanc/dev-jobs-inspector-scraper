const cron = require('node-cron');
const { SEARCH_FOR } = require('../scraper/config/constants');

const Bumeran = require('../scraper/bumeranScraper');
const Zonajobs = require('../scraper/zonajobsScraper');

module.exports = async () => {
  const zonajobs = new Zonajobs(SEARCH_FOR);
  await zonajobs.scraper();

  const bumeran = new Bumeran(SEARCH_FOR);
  await bumeran.scraper();
};
