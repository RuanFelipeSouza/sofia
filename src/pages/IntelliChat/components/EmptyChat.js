import React from 'react';
import { number, string } from 'prop-types';

import { EmptyChatWrapper, EmptyTitle, EmptyText } from './elements';

const EmptyChat = ({ title, text }) => {
  return (
    <EmptyChatWrapper>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyText>{text}</EmptyText>
    </EmptyChatWrapper>
  );
};

EmptyChat.propTypes = {
  width: number,
  height: number,
  image: string,
  title: string,
  text: string
};

EmptyChat.defaultProps = {
  width: 500,
  height: 300
};

export default EmptyChat;