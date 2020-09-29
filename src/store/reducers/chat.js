import * as types from '../actions/types';
import moment from 'moment';
import removeAcento from './../../utils/removeAcento';

const INITIAL_STATE = {
  conversations: [],
  currentConversation: {
    room: null,
    messages: [],
  },
  clientMessages: [],
  chatSelectCount: 0,
  botStateRequest: {
    isLoading: false,
    success: false,
    errorMessage: '',
  },
};

export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case types.SEND_MESSAGE:
      return storeMessage(state, action);
    case types.SEND_WHATSAPP_MESSAGE_REQUEST:
      return storeMessage(state, action);
    case types.SEND_WHATSAPP_MESSAGE_SUCCESS:
      return updateMessageId(state, action);
    case types.MESSAGE_RECEIVED:
      return storeMessage(state, action);
    case types.SELECT_CHAT:
      return selectChat(state, action);
    case types.CLOSE_CHAT:
      return selectClose(state, action);
    case types.USER_JOINED:
      return userJoined(state, action);
    case types.USER_RECONNECTED:
      return userReconnected(state, action);
    case types.USER_DISCONNECTED:
      return userDisconnected(state, action);
    case types.BOT_STATE_CHANGED:
      return changeBotStateSuccess(state, action);
    case types.MESSAGE_STATUS_CHANGED:
      return changeMessageStatus(state, action);
    case types.CHANGE_BOT_STATE_REQUEST:
      return changeBotStateRequest(state);
    case types.CHANGE_BOT_STATE_SUCCESS:
      return changeBotStateSuccess(state, action);
    case types.CHANGE_BOT_STATE_FAILURE:
      return changeBotStateFailure(state, action);
    case types.FETCH_ONGOING_CONVERSATIONS_SUCCESS:
      return fetchOngoingConversations(state, action);
    default:
      return state;
  }
}

const storeMessage = (state, action) => {
  const { text, date, room } = action.payload;
  const {
    room: currentRoom,
    messages: currentMessages,
  } = state.currentConversation;
  const conversationToUpdate = state.conversations.find(
    (item) => item.room === room
  );
  return {
    ...state,
    conversations: [
      {
        ...conversationToUpdate,
        unread:
          state.currentConversation.room !== conversationToUpdate.room
            ? conversationToUpdate.unread + 1
            : conversationToUpdate.unread,
        lastMessageText: text,
        lastMessageDate: date,
        messages: [...conversationToUpdate.messages, action.payload],
      },
      ...state.conversations.filter((item) => item.room !== room),
    ],
    currentConversation: {
      ...state.currentConversation,
      messages:
        currentRoom === room
          ? [...currentMessages, action.payload]
          : currentMessages,
    },
  };
};

const updateMessageId = (state, action) => {
  const { room, messageId, tempId } = action.payload;

  return {
    ...state,
    conversations: state.conversations.map((item) => {
      if (item.room === room) {
        return {
          ...item,
          messages: item.messages.map((message) => {
            if (message.tempId === tempId) {
              return {
                ...message,
                messageId,
              };
            }
            return message;
          }),
        };
      }
      return item;
    }),
    currentConversation: {
      ...state.currentConversation,
      messages: state.currentConversation.messages.map((message) => {
        if (message.tempId === tempId) {
          return {
            ...message,
            messageId,
          };
        }
        return message;
      }),
    },
  };
};

const selectChat = (state, action) => {
  const { payload: room } = action;
  const conversation = state.conversations.find((item) => item.room === room);

  return {
    ...state,
    conversations: state.conversations.map((item) => {
      if (item.room === room) {
        return {
          ...item,
          unread: 0,
        };
      }
      return item;
    }),
    currentConversation: {
      ...conversation,
    },
    chatSelectCount: state.chatSelectCount + 1,
  };
};

const selectClose = (state, { payload: { room } }) => {
  const filteredConversations = state.conversations.filter(
    (item) => item.room !== room
  );
  const currentConversation =
    filteredConversations.length > 0
      ? filteredConversations[0]
      : { room: null, messages: [] };

  return {
    ...state,
    conversations: filteredConversations,
    currentConversation:
      state.currentConversation.room === room
        ? currentConversation
        : state.currentConversation,
  };
};

const toProperCase = (text) => {
  return text
    ? text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
    : 'Sem Nome';
};

const userJoined = (state, action) => {
  const {
    room,
    user: { name, number, cpf },
    socketId,
    messages,
    isWhatsapp,
    sector,
  } = action.payload;
  return {
    ...state,
    conversations: [
      {
        socketId,
        room,
        name: toProperCase(name),
        number,
        cpf,
        lastMessageText: '',
        lastMessageDate: moment().format('HH:mm'),
        unread: messages.length,
        userDisconnected: false,
        messages: messages.map(({ from, text, date }) => {
          return {
            origin:
              removeAcento(from.toLowerCase()) === 'usuario' ? 'user' : 'agent',
            text,
            date: moment(date).format('HH:mm'),
          };
        }),
        isWhatsapp,
        //TODO: maybe isBotOn will begin turned off
        isBotOn: true,
        category: sector,
      },
      ...state.conversations,
    ],
  };
};

const userReconnected = (state, action) => {
  const { room, socketId } = action.payload;

  return {
    ...state,
    conversations: state.conversations.map((item) => {
      if (item.room === room) {
        return {
          ...item,
          socketId,
          userDisconnected: false,
        };
      }
      return item;
    }),
    currentConversation:
      state.currentConversation.room === room
        ? Object.assign({}, state.currentConversation, {
          userDisconnected: false,
          socketId,
        })
        : state.currentConversation,
  };
};

const userDisconnected = (state, { payload }) => {
  return {
    ...state,
    conversations: state.conversations.map((item) => {
      if (item.room === payload || item.socketId === payload) {
        return {
          ...item,
          userDisconnected: true,
        };
      }
      return item;
    }),
    currentConversation:
      state.currentConversation.room === payload ||
      state.currentConversation.socketId === payload
        ? Object.assign({}, state.currentConversation, {
          userDisconnected: true,
        })
        : state.currentConversation,
  };
};

const changeBotStateRequest = (state) => {
  return {
    ...state,
    botStateRequest: {
      isLoading: true,
      success: false,
      errorMessage: '',
    },
  };
};

const changeBotStateFailure = (state, action) => {
  return {
    ...state,
    botStateRequest: {
      isLoading: false,
      success: false,
      errorMessage: action.payload,
    },
  };
};

const changeBotStateSuccess = (state, action) => {
  const { room, botState } = action.payload;

  return {
    ...state,
    conversations: state.conversations.map((item) => {
      if (item.room === room) {
        return {
          ...item,
          isBotOn: botState,
        };
      }
      return item;
    }),
    currentConversation:
      state.currentConversation.room === room
        ? Object.assign({}, state.currentConversation, { isBotOn: botState })
        : state.currentConversation,
    botStateRequest: {
      isLoading: false,
      success: true,
      errorMessage: '',
    },
  };
};

const changeMessageStatus = (state, action) => {
  const { number, messageId, status, id } = action.payload;
  return {
    ...state,
    conversations: state.conversations.map((item) => {
      if (item.number === number) {
        return {
          ...item,
          messages: item.messages.map((message) => {
            if (message.MessageSid === messageId || message.tempId === id) {
              return {
                ...message,
                status,
              };
            }
            return message;
          }),
        };
      }
      return item;
    }),
    currentConversation: {
      ...state.currentConversation,
      messages: state.currentConversation.messages.map((message) => {
        if (message.MessageSid === messageId || message.tempId === id) {
          return {
            ...message,
            status,
          };
        }
        return message;
      }),
    },
  };
};

const fetchOngoingConversations = (state, action) => {
  // TODO: Allow turn bot on/off. Should destructure the variable 'botStates'
  // when implementing it
  const { conversations: fetchedConversations } = action.payload;

  const conversations = fetchedConversations.map(
    ({ _id, messages, user, sector }, index) => {
      const lastMessageIndex = messages.length - 1;
      const messagesList = messages.map(({ _id, from, date, ...rest }) => {
        return {
          messageId: _id,
          origin: from === 'Assistente' ? 'agent' : 'user',
          date: moment(date).format('HH:mm'),
          ...rest,
        };
      });

      return {
        socketId: index,
        room: _id,
        name: toProperCase(user && user.name),
        number: user?.userNumber,
        unread: 0,
        userDisconnected: false,
        isWhatsapp: !!user?.userNumber,
        isBotOn: true, // TODO busca status do bot
        messages: messagesList,
        lastMessageText: messages[lastMessageIndex].text,
        lastMessageDate: moment(messages[lastMessageIndex].date).format(
          'HH:mm'
        ),
        category: sector,
      };
    }
  );

  return {
    ...state,
    conversations: conversations.sort((a, b) =>
      a.lastMessageDate > b.lastMessageDate ? -1 : 1
    ),
    currentConversation: {
      room: null,
      messages: [],
    },
  };
};
