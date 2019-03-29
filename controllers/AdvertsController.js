const mongoose = require('mongoose');
const logger = require('../services/logger');
const Advert = mongoose.model('Advert');

module.exports = () => ({
  findAll: async () => await Advert.find().catch(e => logger.error(e.message)),
  save: async newAdvert => new Advert(newAdvert).save().catch(e => logger.error(e.message))
});
