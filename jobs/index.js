const cron = require('node-cron');
const { SEARCH_FOR } = require('../scraper/config/constants');

const Zonajobs = require('../scraper/zonajobs');

module.exports = async () => {
  const zonajobs = new Zonajobs(SEARCH_FOR);
  await zonajobs.scraper();
};
