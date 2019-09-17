const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const createIO = require('./io');
const db = require('./db');
const { addIo, auth } = require('./middleware');

const app = express();
const server = http.createServer(app);
const io = createIO(server);

app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(addIo(io));

app.use('/users', require('./routes/users'));
app.use('/rooms', auth, require('./routes/rooms'));
app.use('/games', auth, require('./routes/games'));

server.listen(8080, () => {
  db.connect();
  console.log('Started listening on port 8080!');
});
