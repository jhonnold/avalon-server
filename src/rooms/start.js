const store = require('../store');
const { createGame } = require('../ducks/games');
const { deleteRoom } = require('../ducks/rooms');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const room = rooms[roomId];
  const { id: userId } = req.user;
  if (room.hostId !== userId) return res.sendStatus(403);
  if (room.users.length < 5) return res.sendStatus(405);

  store.dispatch(createGame(room));
  store.dispatch(deleteRoom(roomId));

  res.io.emit('game started', { gameId: roomId });
  res.io.emit('room deleted', { roomId });
  res.sendStatus(204);
};