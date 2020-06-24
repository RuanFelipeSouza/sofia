import * as types from '../actions/types';

const INITIAL_STATE = {
  drawerActive: false,
  snackBar: {
    action: 'Ok!',
    active: false,
    label: '',
    timeout: 5000,
    type: 'accept' //accept, warning, cancel
  },
  dialog: {
    actions: null,
    active: false,
    title: '',
    message: ''
  },
  sidebar: {
    active: false,
    user: {
      name: '',
      phone: '',
      cpf: '',
      conversationId: '',
      totalMessages: 0
    }
  }
};

export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case types.TOGGLE_DRAWER:
      return toggleDrawer(state);
    case types.SHOW_SNACKBAR:
      return showSnackbar(state, action);
    case types.HIDE_SNACKBAR:
      return hideSnackbar(state);
    case types.SHOW_DIALOG:
      return showDialog(state, action);
    case types.HIDE_DIALOG:
      return hideDialog(state);
    case types.TOGGLE_SIDEBAR:
      return toggleSidebar(state, action);
    default:
      return state;
  }
}

const toggleDrawer = (state) => {

  return {
    ...state,
    drawerActive: !state.drawerActive
  };
};

const showSnackbar = (state, action) => {
  const { label, action: snackBarAction, type } = action.payload;

  return {
    ...state,
    snackBar: {
      ...state.snackBar,
      label,
      action: snackBarAction,
      type,
      active: true
    }
  };
};

const hideSnackbar = (state) => {
  return {
    ...state,
    snackBar: {
      ...state.snackBar,
      active: false
    }
  };
};

const showDialog = (state, action) => {
  const { title, message, actions } = action.payload;

  return {
    ...state,
    dialog: {
      ...state.dialog,
      title,
      message,
      actions,
      active: true
    }
  };
};

const hideDialog = (state) => {

  return {
    ...state,
    dialog: {
      ...state.dialog,
      active: false
    }
  };
};

const toggleSidebar = (state, action) => {
  const { name, number, cpf, conversationId, totalMessages } = action.payload;
  return {
    ...state,
    sidebar: {
      ...state.sidebar,
      active: !state.sidebar.active,
      user: {
        name,
        number,
        cpf,
        conversationId,
        totalMessages
      }
    }
  };
};