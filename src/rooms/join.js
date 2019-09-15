const store = require('../store');
const { connectUser } = require('../ducks/roomConnections');
const getRoom = require('../util/getRoom');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const { id: userId } = req.user;
  store.dispatch(connectUser(roomId, userId));

  res.io.emit('room updated', getRoom(roomId));
  res.sendStatus(204);
};