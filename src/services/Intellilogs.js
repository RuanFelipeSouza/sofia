import axios from 'axios';

import {
  INTELLILOGS_BASE_URL,
  INTELLILOGS_USER,
  INTELLILOGS_PASS
} from './constants';

const endpoints = {
  INTELLILOGS_GET_ONGOING_CONVERSATIONS: 'conversation/fetchOngoingConversations',
  INTELLILOGS_END_SERVICE: 'alterStatusTicket'
};

const basicAuth = `Basic ${Buffer.from(`${INTELLILOGS_USER}:${INTELLILOGS_PASS}`).toString('base64')}`;
const API = axios.create({
  baseURL: INTELLILOGS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: basicAuth
  }
});

export const fetchOngoingConversations = async () => {
  try {
    const { data } = await API.get(endpoints.INTELLILOGS_GET_ONGOING_CONVERSATIONS);
    return data;
  } catch (error) {
    throw new Error('Erro ao buscar conversas em aberto', error);
  }
};

export const endService = async (conversationId) => {
  try {
    const body = {
      conversation_id: conversationId,
      status: 'Finalizado'
    };
    const { data } = await API.post(endpoints.INTELLILOGS_END_SERVICE, body);
    return data;
  } catch (error) {
    throw new Error('Erro ao encerrar atendimento no Intellilogs', error);
  }
};
