import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';

import reducers from './reducers/index';

export const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk, routerMiddleware(history)];

const store = createStore(
  reducers(history),
  composeEnhancers(
    applyMiddleware(...middlewares)
  )
);

export default store;