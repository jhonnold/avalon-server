const basicAuth = require('express-basic-auth');
const store = require('./store');

module.exports = (name, id) => {
  const { users } = store.getState();
  
  if (!(id in users)) return false;

  const { name: savedName, id: savedId } = users[id];
  return basicAuth.safeCompare(name, savedName) && basicAuth.safeCompare(id, savedId);
};