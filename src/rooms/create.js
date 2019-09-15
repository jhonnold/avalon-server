const shortid = require('shortid');
const store = require('../store');
const getRoom = require('../util/getRoom');
const { createRoom } = require('../ducks/rooms');
const { connectUser } = require('../ducks/roomConnections');

module.exports = (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user;

  if (!name) return res.status(400).send('name required');

  const roomId = shortid.generate();

  store.dispatch(createRoom(roomId, name, userId));
  store.dispatch(connectUser(roomId, userId));

  const room = getRoom(roomId);
  
  res.io.emit('room created', room);
  res.status(200).send(room);
};