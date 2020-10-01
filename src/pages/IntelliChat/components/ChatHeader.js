import React from 'react';
import { string, func } from 'prop-types';
import { useTheme } from '@material-ui/core/styles';

import {
  ChatHeaderWrapper,
  ChatHeaderTitle,
  ChatHeaderSubtitle,
  Column,
  Row,
} from './elements';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import ToggleOffRounded from '@material-ui/icons/ToggleOffRounded';
import IconButton from '@material-ui/core/IconButton';
import ToggleOnRounded from '@material-ui/icons/ToggleOnRounded';

const ChatHeader = ({ title, subtitle, onClick, closeChat, isBotOn, statusColor }) => {
  const theme = useTheme();
  return (
    <ChatHeaderWrapper
      onClick={onClick}
      backgroundColor={theme.palette.primary.light}
    >
      <Column>
        <ChatHeaderTitle>{title}</ChatHeaderTitle>
        <ChatHeaderSubtitle>{subtitle}</ChatHeaderSubtitle>
      </Column>
      <Row>
        <IconButton>
          {isBotOn ? (
            <ToggleOffRounded style={{ color: 'white' }} />
          ) : (
            <ToggleOnRounded style={{ color: 'white' }} />
          )}
        </IconButton>
        <IconButton>
          <StarBorderRoundedIcon style={{ color: 'white' }} />
        </IconButton>
        <IconButton onClick={closeChat}>
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
  closeChat: func.isRequired,
  isBotOn: string, 
  statusColor: string
};

export default ChatHeader;
