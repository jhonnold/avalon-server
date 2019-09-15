const store = require('../store');
const { deleteRoom } = require('../ducks/rooms');
const { teardownRoom } = require('../ducks/roomConnections');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const room = rooms[roomId];
  const { id: userId } = req.user;
  if (room.hostId !== userId) return res.sendStatus(403);

  store.dispatch(deleteRoom(roomId));
  store.dispatch(teardownRoom(roomId));
  
  res.io.emit('room deleted', { roomId });
  res.sendStatus(204);
};