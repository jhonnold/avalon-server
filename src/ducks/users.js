const REGISTER_USER = '@avalon/users/REGISTER_USER';

const initialState = [];
const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_USER: {
      return {
        ...state,
        [payload.id]: payload,
      };
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

module.exports = reducer;
