import io from 'socket.io-client';

import { BACKEND_URL } from './constants';
import store from './../store';
import {
  messageReceived, userJoined, userDisconnected, removeChats,
  disconnectUserByRoom, botStateChanged, messageStatusChanged
} from './../store/actions/chat';

let socket;

export const connect = (room, user) => {
  if (!socket) {
    socket = io.connect(BACKEND_URL);

    if (room) {
      socket.emit('joinUser', { room, user });
    }

    socket.on('messageReceived', ({ message, room, origin }) => {
      store.dispatch(messageReceived(message, room, origin));
    });

    socket.on('whatsappMessageReceived', ({ message, room, origin, messageId }) => {
      store.dispatch(messageReceived(message, room, origin, messageId));
    });

    socket.on('userJoined', ({ room, user, socketId, recipientId, conversation, isWhatsapp, sector }) => {
      store.dispatch(userJoined(room, user, socketId, recipientId, conversation, isWhatsapp, sector));
    });

    socket.on('userDisconnected', (socketId) => {
      store.dispatch(userDisconnected(socketId));
    });

    socket.on('alone', (room) => {
      store.dispatch(disconnectUserByRoom(room));
    });

    socket.on('closeChat', ({ room }) => {
      store.dispatch(removeChats(room));
    });

    socket.on('botStateChanged', ({ room, botState }) => {
      store.dispatch(botStateChanged(room, botState));
    });

    socket.on('messageStatusChanged', ({ number, messageId, messageStatus }) => {
      store.dispatch(messageStatusChanged(number, messageId, messageStatus));
    });
  }
};

export const emitMessage = (message, room) => {
  socket.emit('sendMessage', { message, room, origin: 'Assistente' });
};

export const joinAgent = (room) => {
  socket.emit('joinAgent', room);
};