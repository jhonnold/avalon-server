const shortid = require('shortid');
const store = require('../store');
const { createRoom } = require('../ducks/rooms');

module.exports = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('name required');

  const id = shortid.generate();

  store.dispatch(createRoom(id, name, req.user.id));

  const room = store.getState().rooms[id];

  res.io.emit('room created', room);
  res.status(201).send(room);
};