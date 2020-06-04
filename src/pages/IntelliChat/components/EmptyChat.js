import React from 'react';
import { number, string } from 'prop-types';

import { EmptyChatWrapper, EmptyTitle, EmptyText } from './elements';

const EmptyChat = ({ image, width, height, title, text }) => {
  return (
    <EmptyChatWrapper>
      <img src={image} width={width} height={height} alt="chatImage" />
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