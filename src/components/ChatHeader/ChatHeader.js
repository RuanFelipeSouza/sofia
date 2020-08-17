import React from 'react';
import * as S from './styles';
import { HEADER_TITLE } from '../../constants';

const ChatHeader = (props) => {
  return (
    <S.HeaderContainer onClick={props.handleHeaderClick} ismobile={props.ismobile}>
      <S.HeaderData ismobile={props.ismobile}>{HEADER_TITLE}</S.HeaderData>
      <S.CloseIcon />
    </S.HeaderContainer>
  );
};
ChatHeader.propTypes = {
  handleHeaderClick: Boolean,
  ismobile: Boolean
};
export default ChatHeader;
