import {
  OPEN_CONTAINER,
  CLOSE_CONTAINER,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_MOBILE,
  SHOW_RATING_MODAL,
  CLOSE_RATING_MODAL,
  SET_RATED
} from './types';
import store from '../index';
import { OPEN_SIZE, CLOSED_SIZE } from '../../constants';

const updateIframe = data =>
  window.parent.postMessage({ ...data, w: data.w + 20, h: data.h + 20 }, '*');

export const openContainer = (payload) => {
  const infos = { ...store.getState().container, ...(payload ? payload : OPEN_SIZE), open: true };

  updateIframe(infos);
  return {
    type: OPEN_CONTAINER,
    payload: infos
  };
};

export const closeContainer = (payload) => {
  const infos = { ...store.getState().container, ...CLOSED_SIZE, f: false, open: false, ...payload };

  setTimeout(() => updateIframe(infos), 150);
  return {
    type: CLOSE_CONTAINER,
    payload: infos
  };
};

export const setMobile = (payload) => {
  const infos = { ...store.getState().container, ...CLOSED_SIZE, f: false, m: true, open: false, ...payload };

  setTimeout(() => updateIframe(infos), 150);
  return {
    type: SET_MOBILE,
    payload: infos
  };
};

export const openModal = () => {
  const infos = { ...store.getState().container, f: true, modal: true};
  
  updateIframe(infos);
  return {
    type: OPEN_MODAL,
    payload: infos
  };
};

export const closeModal = ({ fullscreen }) => {
  const infos = { ...store.getState().container, f: fullscreen, modal: false};

  setTimeout(() => updateIframe(infos), 250);
  return {
    type: CLOSE_MODAL,
    payload: infos
  };
};

export const showRatingModal = () => {
  return {
    type: SHOW_RATING_MODAL,
    payload: { ratingModal: true }
  };
};

export const closeRatingModal = () => {
  return {
    type: CLOSE_RATING_MODAL,
    payload: { ratingModal: false }
  };
};

export const setRated = () => {
  return {
    type: SET_RATED,
    payload: { hasRated: true }
  };
};