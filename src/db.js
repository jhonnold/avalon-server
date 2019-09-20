const log = require('fancy-log');
const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    mongoose.connect('mongodb://localhost/avalon-server', { useNewUrlParser: true });
    mongoose.connection.on('error', () => log.error('Mongo Connection Error!'));
  },
};