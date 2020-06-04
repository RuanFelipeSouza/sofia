import axios from 'axios';
import * as constants from './constants';

const endpoints = {
  INTELLILOGS_GET_ONGOING_CONVERSATIONS: 'conversation/fetchOngoingConversations',
  INTELLILOGS_END_SERVICE: 'alterStatusTicket'
};

const api = axios.create({
  baseURL: 'http://localhost:3005'
});

let tokenStorage = sessionStorage.getItem('Authorization');

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
    await api.post(constants.CLOSE_CHAT_ENDPOINT, body);
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

export default api;