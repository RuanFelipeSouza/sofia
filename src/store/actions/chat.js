import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { uuid } from 'uuidv4';

import * as types from './types';
import * as Socketio from './../../services/Socketio';
import * as Api from '../../services/Intelliboard';
import * as Twillio from './../../services/Twillio';
import * as Intellilogs from './../../services/Intelliboard';
// import store from './../';
import { showSnackbar } from './layout';
import { TWILIO_NUMBER, TWILLIO_BASE_URL } from '../../env';

export const sendMessage = (messageText, room) => {
  const message = buildMessage(TWILIO_NUMBER, messageText, room, uuid());
  Socketio.emitMessage(messageText, room, message.tempId);
  return types.action(types.SEND_MESSAGE, message);
};

export const sendWhatsappMessage = (number, messageText, room) => {
  const { action, SEND_WHATSAPP_MESSAGE_REQUEST, SEND_WHATSAPP_MESSAGE_SUCCESS } = types;

  return async (dispatch) => {
    try {
      const tempId = uuid();
      const message = buildMessage(TWILIO_NUMBER, messageText, room, null, tempId);
      dispatch(action(SEND_WHATSAPP_MESSAGE_REQUEST, message));
      const messageId = await Twillio.sendMessage(number, messageText);
      Intellilogs.saveMessage(room, messageText, 'Assistente');
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

export const userJoined = (room, user, socketId, recipientId, messages = [], isWhatsapp = false, sector) => {
  return (dispatch, getState) => {
    const { chat } = getState();
    const token = localStorage.getItem('token');
    const { email, isSupervisor } = jwtDecode(token);

    if (email === recipientId || isSupervisor) {
      if (!chat.conversations.find(item => item.room === room)) {
        Socketio.joinAgent(room);
        dispatch(types.action(types.USER_JOINED, { room, user, socketId, messages, isWhatsapp, sector }));
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

export const messageStatusChanged = (number, messageId, status, id) => {
  return (dispatch) => {
    dispatch(types.action(types.MESSAGE_STATUS_CHANGED, { number, messageId, status, id }));
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
  return async () => {
    try {
      await Api.closeChat(room);
      if (number) {
        await Twillio.endService(number);
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const removeChats = (room) => {
  const { action, CLOSE_CHAT } = types;

  return async (dispatch) => {
    try {
      dispatch(action(CLOSE_CHAT, { room }));
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

export const fetchOngoingConversations = () => {
  const { FETCH_ONGOING_CONVERSATIONS_REQUEST, FETCH_ONGOING_CONVERSATIONS_SUCCESS, FETCH_ONGOING_CONVERSATIONS_FAILURE, action } = types;
  return async (dispatch) => {
    try {
      dispatch(action(FETCH_ONGOING_CONVERSATIONS_REQUEST, {}));
      const conversations = await Api.fetchOngoingConversations();
      const botStates = TWILLIO_BASE_URL ? await Twillio.fetchBotState(conversations.map(({ telefone }) => `whatsapp:+${telefone}`)) : [];
      conversations.forEach(({ _id }) => Socketio.joinAgent(_id));
      return dispatch(action(FETCH_ONGOING_CONVERSATIONS_SUCCESS, { conversations, botStates }));
    } catch (e) {
      console.log('Erro ao buscar conversas em andamento', e);
      dispatch(action(FETCH_ONGOING_CONVERSATIONS_FAILURE, {}));
    }
  };
};

const buildMessage = (origin, text, room, messageId = null, tempId = null) => {
  return {
    origin: (origin === TWILIO_NUMBER || origin === 'Assistente') ? 'agent' : 'user',
    text,
    date: moment().format('HH:mm'),
    room,
    status: messageId || tempId ? 'waiting' : '',
    messageId,
    tempId
  };
};