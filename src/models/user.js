const { model, Schema } = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  username: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  isConnected: { type: Boolean, default: false },
  roomConnection: {
    type: String,
    default: null,
  },
  gameConnection: {
    type: String,
    default: null,
  },
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 8)
    .then(password => {
      this.password = password;
      next();
    });
});

userSchema.methods.generateToken = function() {
  const token = jwt.sign({ _id: this._id }, 'Secret');
  return token;
};

userSchema.statics.login = function (username, password) {
  return User.findOne({ username }).select('+password').exec()
    .then(user => {
      if (!user) throw new Error({ error: 'Unknown user!' });

      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then(([isCorrect, user]) => {
      if (!isCorrect) throw new Error({ error: 'Incorrect email!' });

      return user;
    });
};

const User = model('User', userSchema);

module.exports = User;