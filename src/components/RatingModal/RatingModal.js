import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeRatingModal, setRated } from '../../store/actions/container';
import api from '../../services/Assistantapi';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import {
  ChatModal,
  ChatModalInner,
  CloseButton,
  ModalTitle,
  ThumbsDown,
  ThumbsUp,
  SendButton,
  ThumbsUpContainer,
  ThumbsDownContainer,
} from './styles';

const RatingModal = (props) => {
  const [rating, setRating] = useState(null);
  const [observation, setObservation] = useState('');
  const dispatch = useDispatch();
  const actualContext = useSelector(state => state.message.actualContext);

  const _onClose = (e) => {
    e && e.stopPropagation();
    props.closeChat();
    dispatch(closeRatingModal());
  };

  const _stopPropagation = (e) => {
    e.stopPropagation();
  };

  const _rateConversation = (rate) => {
    setRating(rate);
    dispatch(setRated());
    api.rateMessage({ rate: rate ? 'GOOD' : 'BAD', context: actualContext });
  };

  const _sendObservations = () => {
    if (observation) {
      dispatch(setRated());
      api.rateMessage({ observation , context: actualContext });
    }
    _onClose();
  };

  return (
    <ChatModal ismobile={props.isMobile ? 1 : 0} onClick={_onClose}>
      <ChatModalInner onClick={_stopPropagation}>
        <CloseButton onClick={_onClose} style={{ fontSize: 16 }} />
        <ModalTitle> Como avalia o meu atendimento? </ModalTitle>
        <div style={{ height: 10 }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <ThumbsDownContainer onClick={() => _rateConversation(false)} selected={rating === false}>
            <ThumbsDown />
          </ThumbsDownContainer>
          <ThumbsUpContainer onClick={() => _rateConversation(true)} selected={rating === true}>
            <ThumbsUp />
          </ThumbsUpContainer>
        </div>
        <div style={{ height: 15 }}></div>
        <TextField
          id="standard-multiline-static"
          label="Observações"
          multiline
          rows={2}
          onChange={e => setObservation(e.target.value)}
          value={observation}
          placeholder="(Opcional) Escreva aqui alguma observação que você tenha a fazer"
          style={{ width: '100%' }}
        />
        <div style={{ height: 25 }}></div>
        <SendButton
          variant="contained"
          color="inherit"
          endIcon={<Icon>send</Icon>}
          disabled={rating === null && !observation}
          onClick={_sendObservations}
        >
          Enviar
        </SendButton>
      </ChatModalInner>
    </ChatModal>
  );
};
RatingModal.propTypes = {
  closeChat: Function,
  isMobile: Boolean
};
export default RatingModal;