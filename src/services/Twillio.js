import axios from 'axios';

import * as constants from './constants';

const endpoints = {
  TWILLIO_SEND_MESSAGE_ENPOINT: '/enviaMensagem',
  TWILLIO_CHANGE_BOT_STATE: '/trocaStatusUsuario',
  TWILLIO_END_SERVICE: '/encerrarAtendimento',
  TWILLIO_FETCH_BOT_STATE: 'fetchBotState'
};

const API = axios.create({
  baseURL: constants.TWILLIO_BASE_URL
});

export const sendMessage = async (number, input) => {
  const body = {
    number: `${number}`,
    response: '{}',
    input,
    isHumanMessage: true
  };

  return promiseBuilder(endpoints.TWILLIO_SEND_MESSAGE_ENPOINT, body);
};

export const changeBotState = async (number, status) => {
  const body = {
    number: `${number}`,
    status
  };

  return promiseBuilder(endpoints.TWILLIO_CHANGE_BOT_STATE, body);
};

export const endService = async (number) => {
  const body = {
    number: `${number}`
  };

  return promiseBuilder(endpoints.TWILLIO_END_SERVICE, body);
};

export const fetchBotState = async (numbers) => {
  const body = {
    numbers
  };
  return promiseBuilder(endpoints.TWILLIO_FETCH_BOT_STATE, body);
};

const promiseBuilder = async (url, body) => {
  try {
    const { data } = await API.post(url, body);
    return data;
  } catch (error) {
    return error;
  }
};