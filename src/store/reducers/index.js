import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import visibilityFilter from "./visibilityFilter";
import container from './container';
import message from './message';
import input from './input';
import layout from './layout';
import chat from './chat';

export default (history) => combineReducers({
  container,
  message,
  input,
  router: connectRouter(history),
  layout,
  chat,
});
