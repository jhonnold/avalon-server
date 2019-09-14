const store = require('../store');
const { createGame } = require('../ducks/games');
const { deleteRoom } = require('../ducks/rooms');
const { teardownRoom } = require('../ducks/roomConnections');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms, roomConnections } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const room = rooms[roomId];
  const { id: userId } = req.user;
  if (room.hostId !== userId) return res.sendStatus(403);

  const users = roomConnections
    .filter(c => c.roomId === roomId) 
    .map(c => c.userId);

  if (users.length < 5) return res.sendStatus(405);

  store.dispatch(createGame(room, users));
  store.dispatch(teardownRoom(roomId));
  store.dispatch(deleteRoom(roomId));

  res.io.emit('game started', { gameId: roomId });
  res.io.emit('room deleted', { roomId });
  res.sendStatus(204);
};