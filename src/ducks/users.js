const REGISTER_USER = '@avalon/users/REGISTER_USER';
const DISCONNECT_USER = '@avalon/users/DISCONNECT_USER';

const initialState = {};
const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_USER: {
      return {
        ...state,
        [payload.id]: payload,
      };
    }
    case DISCONNECT_USER: {
      const newState = {...state};
      delete newState[payload.id];
      return newState;
    }
    default: {
      return state;
    }
  }
};

reducer.registerUser = (name, id) => ({
  type: REGISTER_USER,
  payload: { name, id },
});

reducer.disconnectUser = (id) => ({
  type: DISCONNECT_USER,
  payload: { id },
});

reducer.types = {
  REGISTER_USER,
  DISCONNECT_USER,
};

module.exports = reducer;
