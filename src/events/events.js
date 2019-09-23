const log = require('fancy-log');
const emitter = require('./emitter');
const io = require('./io');
const Room = require('../models/room');
const Game = require('../models/game');
const User = require('../models/user');

module.exports = () => {
  emitter.on('user connected', async (id, client) => {
    try {
      const user = await User.findById(id).exec();
      if (!user) throw new Error('Connected user unknown!');

      log('User Connected --', user._id, '--', user.displayName);

      user.isConnected = true;
      await user.save();

      client.on('disconnect', () => {
        log('User Disconnected --', user._id, '--', user.displayName);

        user.isConnected = false;
        user.save();
      });
    } catch (error) {
      log.error(error);

      client.disconnect();
    }
  });

  emitter.on('room updated', async (roomId) => {
    if (roomId === null) return;
    
    try {
      const room = await Room.findById(roomId).populate('host users').exec();

      if (!room) throw new Error('Room not found!');
        
      log('Room Updated --', room._id, '--', room.name);
      io.emit('room updated', room);
    } catch (error) {
      log.error(error);
    }
  });

  emitter.on('room deleted', (roomId) => {
    log('Room Deleted --', roomId);
    io.emit('room deleted', { _id: roomId });
  });

  emitter.on('game started', async (gameId) => {
    try {
      const game = await Game.findById(gameId)
        .populate('users', '_id isConnected username displayName')
        .select('-roles').exec();

      if (!game) throw new Error('Game not found!');

      log('Game Started --', game._id, '--', game.name)
      io.emit('game started', game);
    } catch (error) {
      log.error(error);
    }
  });

  emitter.on('game ended', (gameId) => {
    log('Game Ended --', gameId);
    io.emit('game ended', { _id: gameId });
  });

  emitter.on('game restarted', (gameId) => {
    log('Game Restarted --', gameId);
    io.emit('game restarted', { _id: gameId });
  });
};