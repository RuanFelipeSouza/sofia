import * as TYPES from '../actions/types';
import { CLOSED_SIZE } from '../../../src/constants';

const INITIAL_STATE = {
  open: false,
  f: false,
  m: false,
  modal: false,
  ratingModal: false,
  hasRated: false,
  ...CLOSED_SIZE,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.OPEN_CONTAINER:
      return setDefaultPayload(state, action);
    case TYPES.CLOSE_CONTAINER:
      return setDefaultPayload(state, action);
    case TYPES.SET_MOBILE:
      return setDefaultPayload(state, action);
    case TYPES.OPEN_MODAL:
      return setDefaultPayload(state, action);
    case TYPES.CLOSE_MODAL:
      return setDefaultPayload(state, action);
    case TYPES.SHOW_RATING_MODAL:
      return setDefaultPayload(state, action);
    case TYPES.CLOSE_RATING_MODAL:
      return setDefaultPayload(state, action);
    case TYPES.SET_RATED:
      return setDefaultPayload(state, action);
    default:
      return state;
  }
};

const setDefaultPayload = (state, action) => {
  return {
    ...state,
    ...action.payload
  };
};