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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const defaultAvatar = 'https://cdn0.iconfinder.com/data/icons/user-pictures/100/malecostume-512.png';
const whatsappAvatar = 'https://www.sharethis.com/wp-content/uploads/2017/05/WhatsApp.png';

class ChatQueue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  renderQueue() {
    const { conversations, currentRoom, selectChat, closeChat, changeBotState } = this.props;
    const searchTerm = this.state.inputValue?.toUpperCase() || '';

    const filteredConversations = conversations.filter(e => {
      return e.name?.toUpperCase()?.includes(searchTerm) || e.number?.includes(searchTerm) || e.cpf?.includes(searchTerm);
    }) || [];

    let conversationsByCategory = {};
    filteredConversations.forEach(e => {
      const category = e.category || 'Sem Categoria';
      if (!conversationsByCategory[category]) {
        conversationsByCategory[category] = [e];
      } else {
        conversationsByCategory[category].push(e);
      }
    });

    let returnArray = [];
    for (let key in conversationsByCategory) {
      returnArray.push(
        <ExpansionPanel style={{ margin: '2px 0' }}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{key}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ padding: '0px 0px 24px 24px' }}>
            <Column style={{ maxWidth: '100%' }}>
              {this._renderFromConversations(conversationsByCategory[key], currentRoom, selectChat)}
            </Column>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }

    return returnArray;
  }

  _renderFromConversations(conversations, currentRoom, selectChat) {
    return conversations.map(({ name, number, lastMessageText, lastMessageDate, room, unread, userDisconnected, isWhatsapp, isBotOn }) => {
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

  handleOnChange(event) {
    this.setState({ inputValue: event.target.value });
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
            value={this.state.inputValue}
            onChange={(e) => this.handleOnChange(e)}
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
