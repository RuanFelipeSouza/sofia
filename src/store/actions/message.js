import api from '../../services/Assistantapi';
import socket from './../../services/socket';
import { ASSISTANT_SEND_MESSAGE, STORE_MESSAGE, GET_INITIAL_MESSAGE } from './types';
import { disableInput, changePlaceholder, enableInput } from './input';
import { DEFAULT_INPUT_PLACEHOLDER } from '../../constants';
import { openModal } from './container';

const startSendingMessage = payload => {
  return {
    type: ASSISTANT_SEND_MESSAGE,
    payload
  };
};

export const storeMessage = payload => {
  return {
    type: STORE_MESSAGE,
    payload
  };
};

const initialMessage = payload => {
  return {
    type: GET_INITIAL_MESSAGE,
    payload: {
      output: {
        generic: [{ response_type: 'text', text: payload.text }]
      },
      context: payload.context
    }
  };
};

export const sendSocketMessage = (text) => {
  const input = { input: { text } };

  return (dispatch, getState) => {
    dispatch(startSendingMessage(input));
    socket.sendMessage(getState().message.actualContext.room, text);
  };
};

export const sendMessage = (text) => {
  const input = { input: { text } };

  return (dispatch, getState) => {
    dispatch(startSendingMessage(input));
    dispatch(disableInput());
    dispatch(changePlaceholder('Aguarde...'));

    // Get actual context and remove actions before send back
    const context = getState().message.actualContext;
    context.displayModal = void (0);
    context.action = void (0);
    context.selectContent = void (0);
    context.selectSubtitles = void (0);
    context.tableContent = void (0);
    context.buttonLabels = void (0);
    context.mask = void (0);
    context.chatLock = void (0);

    return api.sendMessageToApi({ ...input, context }).then(
      ({ data }) => _handleReceivedWatsonMessage(data, dispatch, getState),
      error => console.error('An error occurred.', error)
    );
  };
};

export const setInitialMessage = () => {
  return dispatch => {
    return api.getInitialMessage().then(
      ({ data }) => dispatch(initialMessage(data))
    );
  };
};

const _handleReceivedWatsonMessage = (data, dispatch, getState) => {
  dispatch(storeMessage(data));

  if (!data?.context?.action) {
    dispatch(enableInput());
    dispatch(changePlaceholder(DEFAULT_INPUT_PLACEHOLDER));
  }

  switch (data?.context?.action) {
    case 'generateButtons':
      if (data?.context?.chatLock) {
        dispatch(disableInput());
        dispatch(changePlaceholder('Clique em um botão acima'));
      } else {
        dispatch(enableInput());
        dispatch(changePlaceholder('Clique em um botão acima'));
      }
      break;
    case 'generateSelect':
      dispatch(disableInput());
      dispatch(changePlaceholder('Selecione uma opção acima'));
      break;
    case 'joinChat':
      socket.connect(data?.context?.room);
      dispatch(enableInput());
      dispatch(changePlaceholder('Fale ao vivo com o atendente...'));
      break;
    default:
      dispatch(enableInput());
      dispatch(changePlaceholder(DEFAULT_INPUT_PLACEHOLDER));
      break;
  }

  const isModal = getState().container.modal;

  if (!isModal && data?.context?.displayModal) {
    dispatch(openModal());
  }
};