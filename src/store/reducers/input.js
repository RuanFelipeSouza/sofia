import * as TYPES from '../actions/types';
import { DEFAULT_INPUT_PLACEHOLDER } from '../../constants';

const INITIAL_STATE = {
  enabled: true,
  placeholder: DEFAULT_INPUT_PLACEHOLDER
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.ENABLE_INPUT:
      return enableInput(state, action);
    case TYPES.DISABLE_INPUT:
      return disableInput(state, action);
    case TYPES.CHANGE_PLACEHOLDER:
      return changePlaceholder(state, action);
    default:
      return state;
  }
};

const enableInput = (state, action) => {
  return {
    ...state,
    ...action.payload
  };
};

const disableInput = (state, action) => {
  return {
    ...state,
    ...action.payload
  };
};

const changePlaceholder = (state, action) => {
  return {
    ...state,
    placeholder: action.payload
  };
};