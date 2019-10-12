const { logger } = require('../util');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const loadUser = async (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth) return next();

  const token = auth.replace('Bearer ', '');
  const data = jwt.verify(token, 'Secret');

  try {
    const user = await User.findById(data._id).exec();
    
    // eslint-disable-next-line require-atomic-updates
    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    next();
  }
};

module.exports = loadUser;