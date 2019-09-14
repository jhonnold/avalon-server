const store = require('../store');

module.exports = (roomId) => {
  const { rooms, roomConnections, users } = store.getState();

  if (!(roomId in rooms)) return null;
  const room = rooms[roomId];

  const names = roomConnections
    .filter(c => c.roomId === roomId)
    .map(c => users[c.userId].name);

  return {
    ...room,
    users: names,
  };
};