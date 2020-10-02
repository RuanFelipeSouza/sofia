import io from 'socket.io-client';

import { INTELLIBOARD_BACKEND_URL } from '../env';
import store from './../store';
import {
  messageReceived,
  userJoined,
  userDisconnected,
  removeChats,
  disconnectUserByRoom,
  botStateChanged,
  messageStatusChanged,
} from './../store/actions/chat';

let socket;

export const connect = (room, user) => {
  if (!socket) {
    socket = io.connect(INTELLIBOARD_BACKEND_URL);

    if (room) {
      socket.emit('joinUser', { room, user });
    }

    socket.on('messageReceived', ({ message, room, origin }) => {
      store.dispatch(messageReceived(message, room, origin));
    });

    socket.on(
      'whatsappMessageReceived',
      ({ message, room, origin, messageId }) => {
        store.dispatch(messageReceived(message, room, origin, messageId));
      }
    );

    socket.on(
      'userJoined',
      ({
        room,
        user,
        socketId,
        recipientId,
        conversation,
        isWhatsapp,
        sector,
      }) => {
        store.dispatch(
          userJoined(
            room,
            user,
            socketId,
            recipientId,
            conversation,
            isWhatsapp,
            sector
          )
        );
      }
    );

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

    socket.on(
      'messageStatusChanged',
      ({ number, messageId, messageStatus, id }) => {
        store.dispatch(messageStatusChanged(number, messageId, messageStatus, id));
      }
    );
  }
};

export const emitMessage = (message, room, id) => {
  socket.emit('sendMessage', { message, id, room, origin: 'Usuário' });
};

export const joinAgent = (room) => {
  socket.emit('joinAgent', room);
};
