export const action = (type, payload) => {
  return payload ? { type, payload } : { type };
};

//Layout Actions
export const TOGGLE_DRAWER = 'layout/TOGGLE_DRAWER';
export const SHOW_SNACKBAR = 'layout/SHOW_SNACKBAR';
export const HIDE_SNACKBAR = 'layout/HIDE_SNACKBAR';
export const SHOW_DIALOG = 'layout/SHOW_DIALOG';
export const HIDE_DIALOG = 'layout/HIDE_DIALOG';
export const TOGGLE_SIDEBAR = 'layout/TOGGLE_SIDEBAR';

//Chat Actions
export const SEND_MESSAGE = 'chat/SEND_MESSAGE';
export const MESSAGE_RECEIVED = 'chat/MESSAGE_RECEIVED';
export const SEND_WHATSAPP_MESSAGE_REQUEST = 'chat/SEND_WHATSAPP_MESSAGE_REQUEST';
export const SEND_WHATSAPP_MESSAGE_SUCCESS = 'chat/SEND_WHATSAPP_MESSAGE_SUCCESS';
export const SEND_WHATSAPP_MESSAGE_FAILURE = 'chat/SEND_WHATSAPP_MESSAGE_FAILURE';
export const SELECT_CHAT = 'chat/SELECT_CHAT';
export const CLOSE_CHAT = 'chat/CLOSE_CHAT';
export const USER_JOINED = 'chat/USER_JOINED';
export const USER_RECONNECTED = 'chat/USER_RECONNECTED';
export const USER_DISCONNECTED = 'chat/USER_DISCONNECTED';
export const BOT_STATE_CHANGED = 'chat/BOT_STATE_CHANGED';
export const MESSAGE_STATUS_CHANGED = 'chat/MESSAGE_STATUS_CHANGED';
export const CHANGE_BOT_STATE_REQUEST = 'chat/CHANGE_BOT_STATE_REQUEST';
export const CHANGE_BOT_STATE_SUCCESS = 'chat/CHANGE_BOT_STATE_SUCCESS';
export const CHANGE_BOT_STATE_FAILURE = 'chat/CHANGE_BOT_STATE_FAILURE';
export const FETCH_ONGOING_CONVERSATIONS_REQUEST = 'chat/FETCH_ONGOING_CONVERSATIONS_REQUEST';
export const FETCH_ONGOING_CONVERSATIONS_SUCCESS = 'chat/FETCH_ONGOING_CONVERSATIONS_SUCCESS';
export const FETCH_ONGOING_CONVERSATIONS_FAILURE = 'chat/FETCH_ONGOING_CONVERSATIONS_FAILURE';

// Container types
export const OPEN_CONTAINER = 'OPEN_CONTAINER';
export const CLOSE_CONTAINER = 'CLOSE_CONTAINER';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const SET_MOBILE = 'SET_MOBILE';
export const SHOW_RATING_MODAL = 'SHOW_RATING_MODAL';
export const CLOSE_RATING_MODAL = 'CLOSE_RATING_MODAL';
export const SET_RATED = 'SET_RATED';

// Messages types
export const ASSISTANT_SEND_MESSAGE = 'SEND_MESSAGE';
export const STORE_MESSAGE = 'STORE_MESSAGE';
export const GET_INITIAL_MESSAGE = 'GET_INITIAL_MESSAGE';

// Input types
export const ENABLE_INPUT = 'ENABLE_INPUT';
export const DISABLE_INPUT = 'DISABLE_INPUT';
export const CHANGE_PLACEHOLDER = 'CHANGE_PLACEHOLDER';