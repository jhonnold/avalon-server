const { logger } = require('../util');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const io = socketIO();

io.on('connect', async (client) => {
  const { token } = client.handshake.query;
  if (!token) return client.disconnect();

  const data = jwt.verify(token, 'Secret');

  const user = await User.findById(data._id).exec();
  user.isConnected = true;
  await user.save();

  io.emit('user updated', user);
  logger.info(`User Connected -- ${user.displayName}`);
  
  client.on('disconnect', async () => {
    user.isConnected = false;
    await user.save();
    
    io.emit('user updated', user);
    logger.info(`User Disconnected -- ${user.displayName}`);
  });
});

module.exports = io;