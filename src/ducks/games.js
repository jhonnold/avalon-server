const createRoles = require('../util/role-generator');

const CREATE_GAME = '@avalon/games/CREATE_GAME';

const initialState = {};
const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_GAME: {
      return {
        ...state,
        [payload.gameId]: payload,
      };
    }
    default: {
      return state;
    }
  }
};

reducer.createGame = room => ({
  type: CREATE_GAME,
  payload: {
    gameId: room.roomId,
    roles: createRoles(room.users),
  },
});

module.exports = reducer;
