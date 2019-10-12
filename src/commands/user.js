const { User } = require('../models');
const { APIError } = require('../util');

module.exports = {
  register: async ({ username, password, displayName }) => {
    
    if (!username) throw new APIError('Invalid params', -32602);
    if (!password) throw new APIError('Invalid params', -32602);
    if (!displayName) throw new APIError('Invalid params', -32602);
    
    const user = new User({ username, password, displayName });
    await user.save();
    
    return { user, token: user.generateToken() };
  },
  login: async ({ username, password }) => {
    if (!username) throw new APIError('Invalid params', -32602);
    if (!password) throw new APIError('Invalid params', -32602);

    const user = await User.login(username, password);
    if (!user) throw new APIError('Login failed', -32001);

    return { user, token: user.generateToken() };
  },
  me: async ({ user }) => {
    if (!user) throw new APIError('Not authorized!', -32005);

    return user;
  },
}