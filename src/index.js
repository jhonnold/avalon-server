const { logger } = require('./util');
const { logging, error, jsonrpc, loadUser } = require('./middleware');
const { io } = require('./events');
const commands = require('./commands');
const db = require('./db');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
io.attach(server);

app.use(logging);
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.post('/rpc', loadUser, jsonrpc(commands));

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => res.sendStatus(405));
app.use(error);

server.listen(8080, () => {
  db.connect();
  
  logger.info('Started listening on port 8080!');
});
