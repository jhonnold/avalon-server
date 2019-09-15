const CONNECT_USER = '@avalon/roomConnections/CONNECT_USER';
const DISCONNECT_USER = '@avalon/roomConnections/DISCONNECT_USER';
const TEARDOWN_ROOM = '@avalon/roomConnections/TEARDOWN_ROOM';
const TEARDOWN_USER = '@avalon/roomConnections/TEARDOWN_USER';

const initialState = [];
const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CONNECT_USER: {
      return [
        ...state,
        payload,
      ];
    }

    case DISCONNECT_USER: {
      const { userId, roomId } = payload;

      return state.filter(c => !(c.userId === userId && c.roomId === roomId));
    }

    case TEARDOWN_USER: {
      const { userId } = payload;

      return state.filter(c => c.userId !== userId);
    }

    case TEARDOWN_ROOM: {
      const { roomId } = payload;

      return state.filter(c => c.roomId !== roomId);
    }

    default: {
      return state;
    }
  }
};

reducer.connectUser = (roomId, userId) => ({
  type: CONNECT_USER,
  payload: {
    roomId,
    userId,
  }
});

reducer.disconnectUser = (roomId, userId) => ({
  type: DISCONNECT_USER,
  payload: {
    userId,
    roomId,
  },
});

reducer.teardownRoom = (roomId) => ({
  type: TEARDOWN_ROOM,
  payload: {
    roomId,
  },
});

reducer.teardownUser = (userId) => ({
  type: TEARDOWN_USER,
  payload: {
    userId,
  },
});

module.exports = reducer;