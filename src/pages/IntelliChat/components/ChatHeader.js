import React from 'react';
import { string, func } from 'prop-types';

import { ChatHeaderWrapper, ChatHeaderTitle, ChatHeaderSubtitle, Column, Row } from './elements';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import IconButton from '@material-ui/core/IconButton';

const ChatHeader = ({ title, subtitle, onClick, closeChat }) => {
  return (
    <ChatHeaderWrapper onClick={onClick}>
      <Column>
        <ChatHeaderTitle>{title}</ChatHeaderTitle>
        <ChatHeaderSubtitle>{subtitle}</ChatHeaderSubtitle>
      </Column>
      <Row>
        <IconButton>
          <StarBorderRoundedIcon style={{ color: 'white' }} />
        </IconButton>
        <IconButton onClick={closeChat} >
          <DeleteForeverRoundedIcon style={{ color: 'white' }} />
        </IconButton>
        <IconButton>
          <MoreVertRoundedIcon style={{ color: 'white' }} />
        </IconButton>
      </Row>
    </ChatHeaderWrapper>
  );
};

ChatHeader.propTypes = {
  title: string.isRequired,
  subtitle: string,
  onClick: func.isRequired,
  closeChat: func.isRequired
};

export default ChatHeader;