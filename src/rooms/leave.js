const store = require('../store');
const { leaveRoom } = require('../ducks/rooms');

module.exports = (req, res) => {
  const { roomId } = req.params;
  const { rooms } = store.getState();
  if (!(roomId in rooms)) return res.sendStatus(404);

  const { id: userId } = req.user;
  if (userId === store.getState().rooms[roomId].hostId) return res.sendStatus(405);
  
  store.dispatch(leaveRoom(roomId, userId));

  const room = store.getState().rooms[roomId];
  res.io.emit('room updated', room);
  res.sendStatus(204);
};