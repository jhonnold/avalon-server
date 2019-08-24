const store = require('../store');
const { deleteRoom } = require('../ducks/rooms');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const room = rooms[roomId];
  const { id: userId } = req.user;
  if (room.hostId !== userId) return res.sendStatus(403);

  store.dispatch(deleteRoom(roomId));
  res.sendStatus(204);
};