const mongoose = require('mongoose');
const logger = require('../services/logger');

const advertSchema = new mongoose.Schema(
  {
    site: {
      type: String,
      required: 'No se proveyó nombre del sitio web que publicó originalmente el aviso'
    },
    location: {
      type: String,
      required: 'No se proveyó la ciudad del trabajo publicado',
      trim: true
    },
    title: {
      type: String,
      index: true,
      required: 'No se proveyó el título del aviso publicado',
      trim: true
    },
    url: {
      type: String,
      required: 'No se preveyó la URL del aviso',
      unique: true
    },
    description: {
      type: String,
      required: 'No se proveyó el cuerpo textual del aviso',
      trim: true
    },
    publisher: {
      type: String,
      required: 'No se proveyó el nombre la consultora o de la empresa que publicó el aviso'
    }
  },
  { timestamps: { createdAt: 'createdAt' } }
);

// Manejar error de inserción de documento duplicado
const handleDuplicate = function(error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    logger.info('Documento duplicado, no se guardardó');
  } else {
    next();
  }
};

advertSchema.post('save', handleDuplicate);

advertSchema.post('save', function(doc) {
  logger.info(`Nuevo documento: ${doc.title} (${doc.site})`);
});

module.exports = mongoose.model('Advert', advertSchema);
