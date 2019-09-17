const { model, Schema } = require('mongoose');
const shortid = require('shortid');
const User = require('./user');
const Room = require('./room');

const gameSchema = new Schema({ 
  _id: { type: String, default: shortid.generate },
  name: String,
  roles: Object,
});

gameSchema.statics.fromRoomId = function (roomId) {
  return Promise.all([
    User.find({ roomConnection: roomId }).exec(),
    Room.findById(roomId).exec(),
  ])
    .then(([users, room]) => {
      console.log(users);
      console.log(room);

      return {};
    });
}

const Game = model('Game', gameSchema);

module.exports = Game;