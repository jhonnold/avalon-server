const emitter = require('./emitter');
const io = require('./io');
const Room = require('../models/room');
const Game = require('../models/game');

module.exports = () => {
  emitter.on('room updated', (roomId) => {
    Room.findById(roomId).exec()
      .then(room => {
        if (!room) throw new Error();

        return room.serialize();
      })
      .then(room => io.emit('room updated', room))
      .catch(console.error);
  });

  emitter.on('room deleted', (roomId) => {
    io.emit('room deleted', { _id: roomId });
  });

  emitter.on('game started', (gameId) => {
    Game.findById(gameId)
      .populate('users', '_id isConnected username displayName')
      .select('-roles')
      .exec()
      .then(game => {
        if (!game) throw new Error();

        io.emit('game started', game);
      })
      .catch(console.error);
  })
};