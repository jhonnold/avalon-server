const _ = require('lodash');
const { APIError } = require('../util');

const jsonrpc = (commands) => async (req, res, next) => {
  const { user } = req;
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== '2.0') 
    return next(new APIError('JSONRPC Specification is not 2.0', -32600));

  if (!_.hasIn(commands, method)) 
    return next(new APIError('Method does not exist', -32601));

  const userInjectedParams = { ...params, user };

  try {
    if (!id) {
      commands[method](userInjectedParams);
      
      return res.sendStatus(204);
    } else {
      const result = await commands[method](userInjectedParams);

      return res.status(200).send({
        jsonrpc: '2.0',
        id,
        result,
      });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = jsonrpc;