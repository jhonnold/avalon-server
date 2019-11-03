const log = require('fancy-log');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const auth = require('./middleware/auth');
const io = require('./events/io');

const app = express();
const server = http.createServer(app);
io.attach(server);

app.use(morgan('dev', { stream: { write: log, } }));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use((req, _, next) => {
  req.io = io; 
  next();
});

app.use('/users', require('./routes/users'));
app.use('/rooms', auth, require('./routes/rooms'));
app.use('/games', auth, require('./routes/games'));
app.use('/missions', auth, require('./routes/missions'));

server.listen(10000, () => {
  db.connect();

  log('Started listening on port 10000!');
});
