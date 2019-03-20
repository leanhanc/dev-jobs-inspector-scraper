const mongoose = require('mongoose');
const logger = require('../services/logger');
const Jobs = mongoose.model('Jobs');

// * CREATE NEW JOB
const save = async newJob => await Jobs.create(newJob).catch(e => logger.error(e));

exports = { save };
