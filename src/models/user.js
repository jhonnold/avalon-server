const { model, Schema } = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  username: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  isConnected: { type: Boolean, default: false },
  roomConnection: { type: Schema.Types.ObjectId, ref: 'Room' },
  gameConnection: { type: Schema.Types.ObjectId, ref: 'Game' },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const password = await bcrypt.hash(this.password, 8);
  this.password = password;

  next();
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, 'Secret');
  return token;
};

userSchema.methods.setGameConnection = function (game) {
  this.roomConnection = null;
  this.gameConnection = game;
  return this.save();
}

userSchema.methods.setRoomConnection = function (room) {
  this.roomConnection = room;
  this.gameConnection = null;
  return this.save();
}

userSchema.statics.login = async function (username, password) {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error('Unknown user!');

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) throw new Error('Incorrect password!');

  return user;
};

const User = model('User', userSchema);

module.exports = User;