const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const emitter = require('./emitter');

const io = socketIO();

io.on('connect', client => {
  const { token } = client.handshake.query;
  if (!token) return client.disconnect();

  const data = jwt.verify(token, 'Secret');
  emitter.emit('user connected', data._id, client);
});

module.exports = io;