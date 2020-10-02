import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { func, bool, array, string } from 'prop-types';

export default function AlertDialog(props) {
  const { visible, handleClose, actions, dialogMessage, title } = props;
  return (
    <div>
      <Dialog
        open={visible}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {actions?.length &&
            actions.map((action, index) => {
              return (
                <Button
                  key={`button${index}`}
                  onClick={action.onClick}
                  color="primary"
                >
                  {action.label}
                </Button>
              );
            })}
        </DialogActions>
      </Dialog>
    </div>
  );
}
AlertDialog.propTypes = {
  title: string,
  dialogMessage: string,
  actions: array,
  visible: bool,
  handleClose: func.isRequired,
};
