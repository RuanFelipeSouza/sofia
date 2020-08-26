import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  conversationStack: [],
  actualContext: {
    isBotOn: true,
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
  const message = {
    text: action.payload.input.text,
    from: 'Usuário',
  };
  return {
    ...state,
    conversationStack: state.conversationStack.concat(message),
    loading: true,
  };
};

const storeMessage = (state, action) => {
  const message = {
    context: action.payload.context,
    from: 'Assistente',
    outputs: action.payload.output.generic, // array with {response_type and text} because watson can has more than one output
  };
  return {
    ...state,
    conversationStack: state.conversationStack.concat(message),
    actualContext: action.payload.context,
    loading: false,
  };
};

const setInitialMessage = (state, action) => {
  const message = {
    context: action.payload.context,
    from: 'Assistente',
    outputs: action.payload.output.generic, // array with {response_type and text} because watson can has more than one output
  };
  return {
    ...state,
    conversationStack: state.conversationStack.concat(message),
    actualContext: action.payload.context || {},
  };
};
