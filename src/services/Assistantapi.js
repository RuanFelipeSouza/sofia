import axios from 'axios';
import { API_URL } from '../constants';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: false
});

const sendMessageToApi = (payload) => {
  return instance.post('/api/message', payload);
};

const getInitialMessage = () => {
  return instance.get('/api/initial-message');
};

const rateMessage = (payload) => {
  return instance.post('/api/rate', payload);
};


export default {
  sendMessageToApi,
  getInitialMessage,
  rateMessage,
};