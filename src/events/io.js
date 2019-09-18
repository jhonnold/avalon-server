const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const io = socketIO();

io.on('connect', client => {
  const { token } = client.handshake.query;
  if (!token) return client.disconnect();

  const data = jwt.verify(token, 'Secret');
  User.findById(data._id).exec()
    .then(user => {
      if (!user) throw new Error();

      user.isConnected = true;
      return user.save();
    })
    .then(user =>
      client.on('disconnect', () => {
        user.isConnected = false;
        return user.save();
      })
    )
    .catch(client.disconnect);
});

module.exports = io;