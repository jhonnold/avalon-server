const { logger } = require('./util');
const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    mongoose.connect('mongodb://localhost/avalon-server', { useNewUrlParser: true });
    mongoose.connection.on('error', () => logger.error('Mongo Connection Error!'));
  },
};