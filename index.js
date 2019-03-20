// Inicializar variables de entorno
require('dotenv').config();

// Inicializar gestión de errores
require('./services/errorHandling');

// Inicializar logger
const logger = require('./services/logger');

logger.info('Dev Job Inspector 🕵️  ready to find new jobs');
