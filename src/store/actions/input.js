import { ENABLE_INPUT, DISABLE_INPUT, CHANGE_PLACEHOLDER } from './types';

export const enableInput = () => {
  return {
    type: ENABLE_INPUT,
    payload: { enabled: true }
  };
};

export const disableInput = () => {
  return {
    type: DISABLE_INPUT,
    payload: { enabled: false }
  };
};

export const changePlaceholder = payload => {
  return {
    type: CHANGE_PLACEHOLDER,
    payload
  };
};