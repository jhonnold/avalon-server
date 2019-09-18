const { model, Schema } = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const emitter = require('../events/emitter');

const userSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  username: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  isConnected: { type: Boolean, default: false },
  roomConnection: { type: String, default: null },
  gameConnection: { type: String, default: null },
});

userSchema.post('init', function () {
  this._db = this.toObject();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 8)
    .then(password => {
      this.password = password;
      next();
    });
});

userSchema.post('save', function (doc) {
  if (doc._db.isConnected != doc.isConnected) {
    emitter.emit('room updated', doc.roomConnection);
  }

  if (doc._db.roomConnection != doc.roomConnection) {
    emitter.emit('room updated', doc._db.roomConnection);
    emitter.emit('room updated', doc.roomConnection);
  }
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

userSchema.statics.login = function (username, password) {
  return User.findOne({ username }).exec()
    .then(user => {
      if (!user) throw new Error({ error: 'Unknown user!' });

      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then(([isCorrect, user]) => {
      if (!isCorrect) throw new Error({ error: 'Incorrect password!' });

      return user;
    });
};

const User = model('User', userSchema);

module.exports = User;