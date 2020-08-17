import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  conversationStack: [],
  actualContext: {
    isBotOn: true
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.ASSISTANT_SEND_MESSAGE:
      return sendMessage(state, action);
    case TYPES.SEND_MESSAGE: 
      return sendMessage(state, action);
    case TYPES.STORE_MESSAGE:
      return storeMessage(state, action);
    case TYPES.GET_INITIAL_MESSAGE:
      return setInitialMessage(state, action);
    default:
      return state;
  }
};

const sendMessage = (state, action) => {
  return {
    ...state,
    conversationStack: state.conversationStack.concat({ userText: action.payload }),
    loading: true
  };
};

const storeMessage = (state, action) => {
  return {
    ...state,
    conversationStack: state.conversationStack.concat({ watsonResponse: action.payload }),
    actualContext: action.payload.context,
    loading: false
  };
};

const setInitialMessage = (state, action) => {
  return {
    ...state,
    conversationStack: state.conversationStack.concat({ watsonResponse: action.payload }),
    actualContext: action.payload.context || {},
  };
};