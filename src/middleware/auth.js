const log = require('fancy-log');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).send({ error: 'Not authorized' });

  const token = auth.replace('Bearer ', '');
  const data = jwt.verify(token, 'Secret');

  try {
    const user = await User.findById(data._id).select('-password').exec();
    if (!user) throw new Error('Bad id!');

    // eslint-disable-next-line require-atomic-updates
    req.user = user;
    next();
  } catch (error) {
    log.error(error);
    res.status(401).send({ error: 'Not authorized' });
  }
};

module.exports = auth;