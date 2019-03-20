const mongoose = require('mongoose');
const logger = require('../services/logger');
const adverts = mongoose.model('Adverts');

module.exports = () => ({
  findAll: async () => await adverts.find().catch(e => logger.error(e)),
  save: async newAdvert => await adverts.create(newAdvert).catch(e => logger.error(e))
});
