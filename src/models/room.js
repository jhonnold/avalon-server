const { model, Schema } = require('mongoose');
const shortid = require('shortid');

const roomSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = model('Room', roomSchema);