const { createStore, combineReducers, compose, applyMiddleware } = require('redux');
const { createLogger } = require('redux-logger');
const roomsReducer = require('./ducks/rooms');
const usersReducer = require('./ducks/users');
const gamesReducer = require('./ducks/games');
const roomConnectionsReducer = require('./ducks/roomConnections');

const configureStore = (initialState = {}) => {
  const reducer = combineReducers({
    rooms: roomsReducer,
    users: usersReducer,
    games: gamesReducer,
    roomConnections: roomConnectionsReducer,
  });

  const logger = createLogger({
    colors: {},
    titleFormatter: action => action.type,
  });

  const enhancer = compose(applyMiddleware(logger));
  return createStore(reducer, initialState, enhancer);
}

module.exports = configureStore();