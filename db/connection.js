const logger = require('../services/logger');
const mongoose = require('mongoose');

// * Registrar modelos
require('../models/Job');

mongoose.connect(process.env.DATABASE_URL, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;

mongoose.connection.on('error', err => {
  logger.error(`⛔ → ${err.message}`);
});

mongoose.connection.on('connected', () =>
  logger.info('Dev Job Inspector 🕵️  ready to find new jobs')
);
