import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MaterialModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    position: 'relative',
    borderRadius: 3,
    flex: 1
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    cursor: 'pointer',
  },
}));

const Fade = React.forwardRef((props, ref) => {
  const { in: open, children, ...other } = props;
  const style = useSpring({
    from: {
      opacity: 0,
      width: '90%',
      height: '90%',
      display: 'flex',
    },
    to: { opacity: open ? 1 : 0 },
    config: {
      duration: 250
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
};

const Modal = (props) => {
  const {onClose, open} = props;
  const classes = useStyles();

  return (
    <MaterialModal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <CloseRoundedIcon className={classes.closeIcon} onClick={onClose} />
          <h2 id="spring-modal-title">Spring modal</h2>
          <p id="spring-modal-description">react-spring animates me.</p>
        </div>
      </Fade>
    </MaterialModal>
  );
};
Modal.propTypes = {
  onClose: Boolean,
  open: Boolean
};
export default Modal;