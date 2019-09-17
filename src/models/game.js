const { model, Schema } = require('mongoose');
const shortid = require('shortid');
const User = require('./user');
const Room = require('./room');
const { roleGenerator } = require('../util/roles');

const gameSchema = new Schema({ 
  _id: { type: String, default: shortid.generate },
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  roles: { type: Map, of: String },
});

gameSchema.statics.fromRoomId = function (roomId) {
  return Promise.all([
    User.find({ roomConnection: roomId }).select('_id isConnected username displayName').exec(),
    Room.findById(roomId).exec(),
  ])
    .then(([users, room]) => {
      const roles = roleGenerator(users.map(u => u._id));
      const game = new Game({ name: room.name, users, roles });

      return game.save();
    });
}

const Game = model('Game', gameSchema);

module.exports = Game;