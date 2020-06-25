import React from 'react';
import { string, func } from 'prop-types';

import { ChatHeaderWrapper, ChatHeaderTitle, ChatHeaderSubtitle, Column, Row } from './elements';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import IconButton from '@material-ui/core/IconButton';

const ChatHeader = ({ title, subtitle, onClick }) => {
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
        <IconButton>
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
  onClick: func.isRequired
};

export default ChatHeader;