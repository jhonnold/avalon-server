const shortid = require('shortid');
const store = require('../store');
const { createRoom } = require('../ducks/rooms');

module.exports = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('name required');

  const roomId = shortid.generate();

  store.dispatch(createRoom(roomId, name, req.user.id));

  const room = store.getState().rooms[roomId];
  res.io.emit('room created', room);
  res.status(201).send(room);
};