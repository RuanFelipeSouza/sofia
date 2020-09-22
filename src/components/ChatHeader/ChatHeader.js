import React, { useState, useEffect } from 'react';
import api from './../../services/Intelliboard';
import {HeaderContainer, HeaderData, CloseIcon} from './styles';
import { HEADER_TITLE } from '../../constants';

const ChatHeader = (props) => {
  const [botName, setBotName] = useState(HEADER_TITLE);

  useEffect(() => {
    api.get('/basicSettings').then(({data}) => {
      setBotName(previousName => data.botName || previousName);
    });
  }, []);
  
  return (
    <HeaderContainer onClick={props.handleHeaderClick} ismobile={props.ismobile}>
      <HeaderData ismobile={props.ismobile}>{botName}</HeaderData>
      <CloseIcon />
    </HeaderContainer>
  );
};
ChatHeader.propTypes = {
  handleHeaderClick: Boolean,
  ismobile: Boolean
};
export default ChatHeader;
