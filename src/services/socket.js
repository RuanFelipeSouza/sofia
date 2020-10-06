import io from 'socket.io-client';
import store from '../store';

import { INTELLIBOARD_URL } from '../constants';
import { storeMessage } from '../store/actions/message';


let socket;

const connect = (room) => {
  socket = io.connect(INTELLIBOARD_URL);

  if (room) {
    socket.emit('joinUser', { room });
  }

  socket.on('messageReceived', ({ message }) => {
    const payload = {
      output: {
        generic: [{ response_type: 'text', text: message }],
        text: message
      },
      context: store.getState().message.actualContext
    };
    store.dispatch(storeMessage(payload));
  });
};

const sendMessage = (room, message) => {
  socket.emit('sendMessage', { room, message, origin: 'Assistente' });
};

export default {
  connect,
  sendMessage
};