/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { ChatItem } from 'react-chat-elements';
import { connect } from 'react-redux';
import { arrayOf, shape, string, func, bool } from 'prop-types';

import 'react-chat-elements/dist/main.css';
import EmptyChat from './components/EmptyChat';
import emptyImg from './../../assets/attendance.jpg';
import {
  ChatQueueWrapper,
  ChatQueueItemWrapper,
  Column,
  ChatHeader,
  ChatHeaderTextContainer,
  ChatHeaderSearch
} from './components/elements';
import { selectChat, closeChat, changeBotState } from './../../store/actions/chat';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import TextField from '@material-ui/core/TextField';

const defaultAvatar = 'https://cdn0.iconfinder.com/data/icons/user-pictures/100/malecostume-512.png';
const whatsappAvatar = 'https://www.sharethis.com/wp-content/uploads/2017/05/WhatsApp.png';

class ChatQueue extends Component {
  renderQueue() {
    const { conversations, currentRoom, selectChat, closeChat, changeBotState } = this.props;

    return conversations.map(({ name, number, lastMessageText, lastMessageDate, room, unread, userDisconnected, isWhatsapp, isBotOn }) => {
      // return (
      //   <TooltipWrapper key={room}
      //     tooltip='Clique com o botão direito para opções'
      //     tooltipPosition='right'
      //     tooltipDelay={1000}
      //     tooltipHideOnClick
      //     isCurrent={room === currentRoom}
      //   >
      //     <ContextMenuTrigger
      //       key={`context-${room}`}
      //       id={CHAT_QUEUE_MENU}
      //       collect={props => props}
      //       onCloseChat={() => closeChat(room, number)}
      //       onChangeBotState={() => changeBotState(room, number, !isBotOn)}
      //       isWhatsapp={isWhatsapp}
      //       isBotOn={isBotOn}
      //     >
      //       <ChatItem
      //         avatar={isWhatsapp ? whatsappAvatar : defaultAvatar}
      //         title={name}
      //         subtitle={lastMessageText}
      //         dateString={lastMessageDate}
      //         unread={unread}
      //         statusColor={userDisconnected || !isBotOn ? 'crimson' : '	lime'}
      //         onClick={() => selectChat(room)}
      //         className='chatItem'
      //       />
      //     </ContextMenuTrigger>
      //   </TooltipWrapper>
      // );
      return (
        <ChatQueueItemWrapper
          key={room}
          isCurrent={room === currentRoom}
        >
          <ChatItem
            avatar={isWhatsapp ? whatsappAvatar : defaultAvatar}
            title={name}
            subtitle={lastMessageText}
            dateString={lastMessageDate}
            unread={unread}
            statusColor={userDisconnected || !isBotOn ? 'crimson' : '	lime'}
            onClick={() => selectChat(room)}
            className='chatItem'
          />
        </ChatQueueItemWrapper>
      );
    });
  }

  render() {
    const { conversations } = this.props;
    const hasConversations = conversations.length > 0;

    return (
      <ChatQueueWrapper>
        <ChatHeader>
          <Avatar />
          <ChatHeaderTextContainer>
            <Typography variant="subtitle2" style={{ fontSize: 16 }}>
              Global Touch
            </Typography>
            <Typography variant="subtitle1" style={{ fontSize: 12 }}>
              Consumo Mensal: R$ 200,00
            </Typography>
          </ChatHeaderTextContainer>
        </ChatHeader>
        <ChatHeaderSearch>
          <SearchRoundedIcon fontSize="small" style={{ color: '#919191', marginRight: 10 }} />
          <TextField
            placeholder="Procurar conversa"
            disabled={!hasConversations}
            fullWidth
            inputProps={{
              style: {
                fontSize: 14
              } 
            }}
          />
        </ChatHeaderSearch>
        
        {hasConversations ? (
          <div style={{ overflow: 'auto' }}>{this.renderQueue()}</div>
        ) : (
          <EmptyChat
            image={emptyImg}
            width={250}
            height={200}
            text="Nenhum atendimento pendente"
          />
        )}
        {/* <ConnectedMenu /> */}
      </ChatQueueWrapper>
    );
  }
}

ChatQueue.propTypes = {
  conversations: arrayOf(shape({
    name: string.isRequired,
    number: string,
    lastMessageText: string.isRequired,
    lastMessageDate: string.isRequired,
    room: string.isRequired,
    userDisconnected: bool.isRequired,
    isWhatsapp: bool.isRequired,
    isBotOn: bool.isRequired
  })),
  currentRoom: string,
  selectChat: func.isRequired,
  closeChat: func.isRequired,
  changeBotState: func.isRequired
};

const mapStateToProps = state => {
  const { conversations, currentConversation } = state.chat;

  return {
    conversations: conversations,
    currentRoom: currentConversation.room
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectChat: (room) => dispatch(selectChat(room)),
    closeChat: (room, number) => dispatch(closeChat(room, number)),
    changeBotState: (room, number, botState) => dispatch(changeBotState(room, number, botState))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatQueue);
