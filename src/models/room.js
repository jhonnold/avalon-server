const { model, Schema } = require('mongoose');
const shortid = require('shortid');
const User = require('./user');
const emitter = require('../events/emitter');

const roomSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

roomSchema.post('save', function (doc) {
  emitter.emit('room updated', doc._id);
});

roomSchema.post(/remove/, function (doc) {
  emitter.emit('room deleted', doc._id);
});

roomSchema.methods.serialize = function () {
  return User.find({ roomConnection: this._id })
    .select('_id isConnected username displayName')
    .exec()
    .then(users => ({
      ...this.toObject(),
      users,
    }));
};

const Room = model('Room', roomSchema);

module.exports = Room;