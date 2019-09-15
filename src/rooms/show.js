const store = require('../store');
const getRoom = require('../util/getRoom');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();

  if (!(roomId in rooms)) return res.sendStatus(404);

  res.send(getRoom(roomId));
};