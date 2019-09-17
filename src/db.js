const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    mongoose.connect('mongodb://localhost/avalon-server', { useNewUrlParser: true });
    mongoose.connection.on('error', () => console.error('Mongo Connection Error!'));
  },
};