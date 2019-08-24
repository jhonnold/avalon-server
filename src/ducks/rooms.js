const CREATE_ROOM = '@avalon/rooms/CREATE_ROOM';

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
    default: {
      return state;
    }
  }
};

reducer.createRoom = (roomId, roomName, hostId, hostName) => ({
  type: CREATE_ROOM,
  payload: { roomId, roomName, hostId, hostName },
});

module.exports = reducer;
