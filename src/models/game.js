const { model, Schema } = require('mongoose');
const { roleGenerator } = require('../util/roles');
const emitter = require('../events/emitter');

const gameSchema = new Schema({ 
  name: String,
  host: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  roles: { type: Map, of: String },
});

gameSchema.post('remove', function (doc) {
  emitter.emit('game ended', doc._id);
});

gameSchema.statics.fromRoom = async function (room) {
  const roles = roleGenerator(room.users.map(u => u._id));
  const users = room.users.map(u => u._id);
  const game = new Game({ name: room.name, users, host: room.host._id, roles });

  await game.save();
  return game.populate('users host').execPopulate();
}

gameSchema.methods.restart = function () {
  this.roles = roleGenerator(this.users.map(u => u._id));
  
  return this.save();
};

const Game = model('Game', gameSchema);

module.exports = Game;