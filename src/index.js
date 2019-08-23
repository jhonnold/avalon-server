const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.server = http.createServer(app);

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/', (_, res) => {
  res.send({ foo: 'bar' });
});

app.server.listen(8080, () => {
  console.log('Started listening on port: 8080');
});