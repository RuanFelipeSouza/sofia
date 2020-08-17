import React from 'react';
import {HeaderContainer, HeaderData, CloseIcon} from './styles';
import { HEADER_TITLE } from '../../constants';

const ChatHeader = (props) => {
  return (
    <HeaderContainer onClick={props.handleHeaderClick} ismobile={props.ismobile}>
      <HeaderData ismobile={props.ismobile}>{HEADER_TITLE}</HeaderData>
      <CloseIcon />
    </HeaderContainer>
  );
};
ChatHeader.propTypes = {
  handleHeaderClick: Boolean,
  ismobile: Boolean
};
export default ChatHeader;
