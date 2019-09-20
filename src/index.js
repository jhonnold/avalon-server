const log = require('fancy-log');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { auth } = require('./middleware');
const io = require('./events/io');
const loadEvents = require('./events/events');

const app = express();
const server = http.createServer(app);

io.attach(server);
loadEvents();

app.use(morgan('dev', { stream: { write: log, } }));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
app.use('/rooms', auth, require('./routes/rooms'));
app.use('/games', auth, require('./routes/games'));

server.listen(8080, () => {
  db.connect();
  
  log('Started listening on port 8080!');
});