import React from 'react';
import { string, func } from 'prop-types';

import { ChatHeaderWrapper, ChatHeaderTitle, ChatHeaderSubtitle } from './elements';

const ChatHeader = ({ title, subtitle, onClick }) => {
  return (
    <ChatHeaderWrapper onClick={onClick}>
      <ChatHeaderTitle>{title}</ChatHeaderTitle>
      <ChatHeaderSubtitle>{subtitle}</ChatHeaderSubtitle>
    </ChatHeaderWrapper>
  );
};

ChatHeader.propTypes = {
  title: string.isRequired,
  subtitle: string,
  onClick: func.isRequired
};

export default ChatHeader;