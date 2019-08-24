const CREATE_ROOM = '@avalon/rooms/CREATE_ROOM';
const DELETE_ROOM = '@avalon/rooms/DELETE_ROOM';

const initialState = {};
const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_ROOM: {
      return {
        ...state,
        [payload.roomId]: payload,
      };
    }
    case DELETE_ROOM: {
      const newState = {...state};
      delete newState[payload.roomId]
      return newState;
    }
    default: {
      return state;
    }
  }
};

reducer.createRoom = (roomId, roomName, hostId) => ({
  type: CREATE_ROOM,
  payload: { roomId, roomName, hostId, users: [ hostId ] },
});

reducer.deleteRoom = (roomId) => ({
  type: DELETE_ROOM,
  payload: { roomId },
});

module.exports = reducer;
