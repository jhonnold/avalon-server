const store = require('../store');

module.exports = (_, res) => {
  res.send(Object.values(store.getState().rooms));
};