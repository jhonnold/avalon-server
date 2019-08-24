const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const store = require('./store');
const { registerUser } = require('./ducks/users');

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

io.on('connect', client => {
  const { name } = client.handshake.query;

  if (name) {
    store.dispatch(registerUser(name, client.id));
    client.emit('handshake completed', client.id);
  }
});


app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use((_, res, next) => {
  res.io = io;
  next();
});

app.use('/rooms', require('./rooms'));

server.listen(8080, () => {
  console.log('Started listening on port 8080!');
});