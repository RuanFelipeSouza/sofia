import moment from 'moment';
import jwtDecode from 'jwt-decode';
import uuidv4 from 'uuid/v4';

import * as types from './types';
import * as Socketio from './../../services/Socketio';
import * as Api from './../../services/api';
import * as Twillio from './../../services/Twillio';
// import * as Assistant from './../../services/Assistant';
// import * as Intellilogs from './../../services/Intellilogs';
// import store from './../';
import { showSnackbar } from './layout';
import { ASSISTANT_WHATSAPP, TWILLIO_BASE_URL } from './../../services/constants';

export const sendMessage = (messageText, room) => {
  const message = buildMessage(ASSISTANT_WHATSAPP, messageText, room);
  Socketio.emitMessage(messageText, room);
  return types.action(types.SEND_MESSAGE, message);
};

export const sendWhatsappMessage = (number, messageText, room) => {
  const { action, SEND_WHATSAPP_MESSAGE_REQUEST, SEND_WHATSAPP_MESSAGE_SUCCESS } = types;

  return async (dispatch) => {
    try {
      const tempId = uuidv4();
      const message = buildMessage(ASSISTANT_WHATSAPP, messageText, room, null, tempId);
      dispatch(action(SEND_WHATSAPP_MESSAGE_REQUEST, message));
      const messageId = await Twillio.sendMessage(number, messageText);
      dispatch(action(SEND_WHATSAPP_MESSAGE_SUCCESS, { room, tempId, messageId }));
    } catch (e) {
      console.log(e);
    }
  };
};

export const messageReceived = (messageText, room, origin = 'client', messageId) => {
  return (dispatch) => {
    const message = buildMessage(origin, messageText, room, messageId);
    dispatch(types.action(types.MESSAGE_RECEIVED, message));
  };
};

export const userJoined = (room, user, socketId, recipientId, messages = [], isWhatsapp = false) => {
  return (dispatch, getState) => {
    console.log(room, user, socketId, recipientId);
    const { chat } = getState();
    const token = sessionStorage.getItem('Authorization');
    console.log(jwtDecode(token.replace('Bearer ', '')));

    if (jwtDecode(token.replace('Bearer ', '')).email === recipientId) {
      if (!chat.conversations.find(item => item.room === room)) {
        Socketio.joinAgent(room);
        dispatch(types.action(types.USER_JOINED, { room, user, socketId, messages, isWhatsapp }));
        /* TODO adicionar mensagem de alerta quando usuário receber mensagem e não 
         estiver na rota do intellichat */
        // if (store.getState().router.location.pathname !== '/chat') {
        // dispatch(showSnackbar('Um cliente quer falar com você', 'Dispensar', 'accept'));
        // }
      } else {
        dispatch(types.action(types.USER_RECONNECTED, { room, socketId }));
      }
    }
  };
};

export const userDisconnected = (socketId) => {
  return (dispatch) => {
    dispatch(types.action(types.USER_DISCONNECTED, socketId));
  };
};

export const disconnectUserByRoom = (room) => {
  return (dispatch, getState) => {
    const { chat: { conversations } } = getState();
    const roomConversation = conversations.find((c => c.room === room));
    if (roomConversation) {
      dispatch(types.action(types.USER_DISCONNECTED, roomConversation.room));
    }
  };
};

export const botStateChanged = (room, botState) => {
  return (dispatch) => {
    dispatch(types.action(types.BOT_STATE_CHANGED, { room, botState }));
  };
};

export const messageStatusChanged = (number, messageId, status) => {
  return (dispatch) => {
    dispatch(types.action(types.MESSAGE_STATUS_CHANGED, { number, messageId, status }));
  };
};

export const changeBotState = (room, number, botState) => {
  const { action, CHANGE_BOT_STATE_REQUEST, CHANGE_BOT_STATE_SUCCESS, CHANGE_BOT_STATE_FAILURE } = types;

  return async (dispatch) => {
    try {
      dispatch(action(CHANGE_BOT_STATE_REQUEST, {}));
      await Twillio.changeBotState(number, botState);
      return dispatch(action(CHANGE_BOT_STATE_SUCCESS, { room, botState }));
    } catch (e) {
      const errorMessage = `Não foi possível ${botState ? 'ligar' : 'desligar'} o robô`;
      dispatch(action(CHANGE_BOT_STATE_FAILURE, errorMessage));
      dispatch(showSnackbar(errorMessage, 'Dispensar', 'cancel'));
      console.log(e, errorMessage);
    }
  };
};

export const selectChat = (room) => {
  return types.action(types.SELECT_CHAT, room);
};

export const closeChat = (room, number) => {
  const { action, CLOSE_CHAT } = types;

  return async (dispatch) => {
    try {
      await Api.closeChat(room);
      if (number) {
        await Twillio.endService(number);
      }
      dispatch(action(CLOSE_CHAT, { room, number }));
    } catch (e) {
      console.log(e);
    }
  };
};

export const disableBotAndSendMessage = (room, number, message) => {
  const { action, HIDE_DIALOG } = types;

  return async (dispatch, getState) => {
    try {
      await dispatch(changeBotState(room, number, false));
      if (getState().chat.botStateRequest.success) {
        dispatch(sendWhatsappMessage(number, message, room));
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(action(HIDE_DIALOG, {}));
    }
  };
};

// export const contactCustomers = () => {
//   return async (dispatch) => {
//     try {
//       await Assistant.contactCustomer();
//       dispatch(showSnackbar('Mensagens disparadas', 'Dispensar', 'accept'));
//     } catch (e) {
//       console.log('Erro ao contactar clientes', e);
//       const errorMessage = e.response && e.response.data ? e.response.data : 'Erro ao contactar clientes';
//       dispatch(showSnackbar(errorMessage, 'Dispensar', 'cancel'));
//     }
//   };
// };

export const fetchOngoingConversations = () => {
  const { FETCH_ONGOING_CONVERSATIONS_REQUEST, FETCH_ONGOING_CONVERSATIONS_SUCCESS, FETCH_ONGOING_CONVERSATIONS_FAILURE, action } = types;
  return async (dispatch) => {
    try {
      dispatch(action(FETCH_ONGOING_CONVERSATIONS_REQUEST, {}));
      const conversations = await Api.fetchOngoingConversations();
      const botStates = TWILLIO_BASE_URL ? await Twillio.fetchBotState(conversations.map(({ telefone }) => `whatsapp:+${telefone}`)) : [];
      new Set(
        conversations
          .filter(({ telefone }) => !telefone)
          .map(({ id }) => id)
      ).forEach((id) => Socketio.joinAgent(id));
      return dispatch(action(FETCH_ONGOING_CONVERSATIONS_SUCCESS, { conversations, botStates }));
    } catch (e) {
      console.log('Erro ao buscar conversas em andamento', e);
      dispatch(action(FETCH_ONGOING_CONVERSATIONS_FAILURE, {}));
    }
  };
};

const buildMessage = (origin, text, room, messageId = null, tempId = null) => {
  return {
    origin: origin === ASSISTANT_WHATSAPP ? 'agent' : 'user',
    text,
    date: moment().format('HH:mm'),
    room,
    status: messageId || tempId ? 'waiting' : '',
    messageId,
    tempId
  };
};