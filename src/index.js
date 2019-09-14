const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const basicAuth = require('express-basic-auth');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const authorizer = require('./auth');
const store = require('./store');
const { registerUser, disconnectUser } = require('./ducks/users');
const { teardownUser, teardownRoom } = require('./ducks/roomConnections');
const { deleteRoom } = require('./ducks/rooms');
const getRoom = require('./util/getRoom');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

io.on('connect', client => {
  const { name } = client.handshake.query;

  if (name) {
    store.dispatch(registerUser(name, client.id));
    client.emit('handshake completed', client.id);
  }

  client.on('disconnect', () => {
    const { roomConnections, rooms } = store.getState();
    const changingRooms = new Set(roomConnections
        .filter(c => c.userId === client.id)
        .map(c => c.roomId));

    const deletedRooms = new Set(Object.values(rooms).filter(r => r.hostId === client.id).map(r => r.roomId));

    store.dispatch(disconnectUser(client.id));
    store.dispatch(teardownUser(client.id));
    changingRooms.forEach(r => io.emit('room updated', getRoom(r)));

    deletedRooms.forEach(r => {
      store.dispatch(deleteRoom(r));
      store.dispatch(teardownRoom(r));

      io.emit('room deleted', { roomId: r });
    });
  });
});

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use(basicAuth({ authorizer }));
app.use((req, _, next) => {
  const { password } = req.auth;

  req.user = store.getState().users[password];
  next();
});
app.use((_, res, next) => {
  res.io = io;
  next();
});

app.use('/rooms', require('./rooms'));

server.listen(8080, () => {
  console.log('Started listening on port 8080!');
});
