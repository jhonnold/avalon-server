const store = require('../store');
const getRoom = require('../util/getRoom');
const { disconnectUser } = require('../ducks/roomConnections');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const { id: userId } = req.user;
  const room = rooms[roomId];
  if (userId === room.hostId) return res.sendStatus(405);
  
  store.dispatch(disconnectUser(roomId, userId));

  res.io.emit('room updated', getRoom(roomId));
  res.sendStatus(204);
};