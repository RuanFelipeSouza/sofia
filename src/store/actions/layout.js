import * as types from './types';

export const toggleDrawer = () => {
  return types.action(types.TOGGLE_DRAWER, {});
};

export const showSnackbar = (label, action, type) => {
  return types.action(types.SHOW_SNACKBAR, { label, action, type });
};

export const hideSnackbar = () => {
  return types.action(types.HIDE_SNACKBAR, {});
};

export const showDialog = (title, message, actions) => {
  return types.action(types.SHOW_DIALOG, { title, message, actions });
};

export const hideDialog = () => {
  return types.action(types.HIDE_DIALOG, {});
};

export const toggleSidebar = (userInfo = {}) => {
  return types.action(types.TOGGLE_SIDEBAR, userInfo);
};