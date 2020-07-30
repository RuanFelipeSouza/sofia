import axios from 'axios';
import * as constants from '../env';

const endpoints = {
  INTELLILOGS_GET_ONGOING_CONVERSATIONS: 'conversation/fetchOngoingConversations',
  INTELLILOGS_END_SERVICE: 'alterStatusTicket',
  INTELLILOGS_SAVE_MESSAGE: 'conversation/add',
  CLOSE_CHAT_ENDPOINT: '/chat/close'
};

const api = axios.create({
  baseURL: constants.INTELLIBOARD_BACKEND_URL
});

let tokenStorage = localStorage.getItem('Authorization');

if (tokenStorage) {
  api.defaults.headers.common = {
    Authorization: tokenStorage
  };
}

export const closeChat = async (room) => {
  const body = {
    room
  };

  try {
    await api.post(endpoints.CLOSE_CHAT_ENDPOINT, body);
    return;
  } catch (e) {
    console.log('Erro ao fechar chat', e);
  }
};

export const fetchOngoingConversations = async () => {
  try {
    const { data } = await api.get(endpoints.INTELLILOGS_GET_ONGOING_CONVERSATIONS);
    return data;
  } catch (error) {
    throw new Error('Erro ao buscar conversas em aberto', error);
  }
};

export const saveMessage = (id, mensagem, origem) => {
  try {
    const body = { id, mensagem, origem };

    api.post(endpoints.INTELLILOGS_SAVE_MESSAGE, body);
    return;
  } catch (error) {
    throw new Error('Erro ao buscar conversas em aberto', error);
  }
};

export default api;