const log = require('fancy-log');
const emitter = require('./emitter');
const io = require('./io');
const Room = require('../models/room');
const Game = require('../models/game');
const User = require('../models/user');

module.exports = () => {
  emitter.on('user connected', (id, client) => {

    User.findById(id).exec()
      .then(user => {
        if (!user) throw new Error();

        log('User Connected --', user._id, '--', user.displayName);

        user.isConnected = true;
        return user.save();
      })
      .then(user => {
        client.on('disconnect', () => {
          log('User Disconnected --', user._id, '--', user.displayName);

          user.isConnected = false;
          return user.save();
        })
      })
      .catch(client.disconnect);
  });

  emitter.on('room updated', (roomId) => {
    if (roomId === null) return;

    Room.findById(roomId).populate('host').exec()
      .then(room => {
        if (!room) throw new Error('Room not found!');

        return room.serialize();
      })
      .then(room => {
        log('Room Updated --', room._id, '--', room.name);
        io.emit('room updated', room);
      })
      .catch(log.error);
  });

  emitter.on('room deleted', (roomId) => {
    log('Room Deleted --', roomId);
    io.emit('room deleted', { _id: roomId });
  });

  emitter.on('game started', (gameId) => {
    Game.findById(gameId)
      .populate('users', '_id isConnected username displayName')
      .select('-roles')
      .exec()
      .then(game => {
        if (!game) throw new Error();

        log('Game Started --', game._id, '--', game.name)
        io.emit('game started', game);
      })
      .catch(log.error);
  })
};