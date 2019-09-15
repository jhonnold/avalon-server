const store = require('../store');
const getRoom = require('../util/getRoom');

module.exports = (_, res) => {
  const { rooms } = store.getState();

  res.send(Object.keys(rooms).map(getRoom));
};