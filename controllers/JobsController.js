const mongoose = require('mongoose');
const logger = require('../services/logger');
const Jobs = mongoose.model('Jobs');

module.exports = () => ({
  save: async newJob => await Jobs.create(newJob).catch(e => logger.error(e)),
  findAll: async () => await Jobs.find().catch(e => logger.error(e))
});
