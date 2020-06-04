import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import layout from './layout';
import chat from './chat';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  layout,
  chat,
});

export default rootReducer;