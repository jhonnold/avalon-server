const { logger } = require('../util');

const DEFAULT_ERROR = {
  message: 'Unknown Error',
  code: -32000,
};

// eslint-disable-next-line no-unused-vars
const error = (err, req, res, next) => {
  logger.error(err.stack);

  const { api } = err;
  const { id } = req.body;

  return res.status(200).send({
    jsonrpc: '2.0',
    error: api || DEFAULT_ERROR,
    id: id || null,
  });
};

module.exports = error;