const _ = require('lodash');
const { model, Schema } = require('mongoose');
const Mission = require('./mission');
const { roleGenerator } = require('../util/roles');

const gameSchema = new Schema({
  name: String,
  host: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  roles: { type: Map, of: String },
  active: { type: Boolean, default: true },
  missions: [{ type: Schema.Types.ObjectId, ref: 'Mission' }],
});

gameSchema.statics.fromRoom = async function (room) {
  const users = room.users.map(u => u._id);
  const roles = roleGenerator(users);
  const missions = await Mission.createForCount(users.length);

  const game = new Game({ 
    name: room.name, 
    users, 
    host: room.host._id, 
    roles,
    missions,
  });

  await game.save();
  return game.populate('users host').execPopulate();
}

gameSchema.statics.fromGame = async function (oldGame) {
  const users = oldGame.users.map(u => u._id);
  const roles = roleGenerator(users);
  const missions = await Mission.createForCount(users.length);

  const game = new Game({
    name: oldGame.name,
    users,
    host: oldGame.host._id,
    roles,
    missions,
  });

  await game.save();
  return game.populate('users host').execPopulate();
};

gameSchema.set('toJSON', { virtuals: true });
const Game = model('Game', gameSchema);

module.exports = Game;