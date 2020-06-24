import React, { Component } from 'react';
import { arrayOf, string, func, object, bool, number } from 'prop-types';
import { connect } from 'react-redux';

import './components/chat.css';
import ChatDialog from './components/ChatDialog';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import { ChatWrapper } from './components/elements';
import { sendMessage, sendWhatsappMessage, closeChat, disableBotAndSendMessage } from '../../store/actions/chat';
// import { showDialog, hideDialog, toggleSidebar } from '../../store/actions/layout';

class ChatConversation extends Component {
  handleSendMessage(message) {
    const { sendMessage, room } = this.props;
    sendMessage(message, room);
  }

  handleSendWhatsappMessage(number, message, isBotOn) {
    const { sendWhatsappMessage, showDialog, hideDialog, room, disableBotAndSendMessage } = this.props;

    if (isBotOn) {
      const title = 'Atenção!';
      const dialogMessage = 'Você está tentando enviar mensagem para um usuário que está com atendimento automático habilitado. O que deseja fazer?';
      const actions = [
        { label: 'Não enviar a mensagem', onClick: () => hideDialog() },
        { label: 'Desabilitar o robô e enviar a mensagem', onClick: () => disableBotAndSendMessage(room, number, message) }
      ];
      showDialog(title, dialogMessage, actions);
    } else {
      sendWhatsappMessage(number, message, room);
    }
  }

  formatNumber(number) {
    return number ? number.replace(/(\D*)(\d{2})*(\d{2})(\d{1})*(\d{4})(\d{4})/, '($3) $4 $5-$6') : '';
  }

  render() {
    const { messages, clientMessages, room, name, number, cpf, userDisconnected, closeChat, chatSelectCount, isWhatsapp, isBotOn, toggleSidebar } = this.props;
    const userInfo = {
      name,
      number: this.formatNumber(number),
      cpf,
      conversationId: room,
      totalMessages: messages.length,
      showInteractionCost: isWhatsapp
    };

    return (
      <ChatWrapper>
        <ChatHeader
          title={name}
          subtitle={isWhatsapp ? this.formatNumber(number) : cpf}
          onClick={() => toggleSidebar(userInfo)}
        />
        <ChatDialog
          messages={room ? messages : clientMessages}
          userDisconnected={userDisconnected}
          room={room}
          closeChat={closeChat}
          userName={name}
          userNumber={number}
        />
        <ChatInput
          sendMessage={(message) => isWhatsapp ? this.handleSendWhatsappMessage(number, message, isBotOn) : this.handleSendMessage(message)}
          chatSelectCount={chatSelectCount}
          isDisabled={userDisconnected}
        />
      </ChatWrapper>
    );
  }
}

ChatConversation.propTypes = {
  messages: arrayOf(object),
  clientMessages: arrayOf(object),
  room: string,
  name: string,
  number: string,
  cpf: string,
  userDisconnected: bool,
  sendMessage: func.isRequired,
  sendWhatsappMessage: func.isRequired,
  closeChat: func.isRequired,
  chatSelectCount: number.isRequired,
  isWhatsapp: bool.isRequired,
  showDialog: func.isRequired,
  hideDialog: func.isRequired,
  disableBotAndSendMessage: func.isRequired,
  isBotOn: bool,
  toggleSidebar: func.isRequired
};

const mapStateToProps = state => {
  const { messages, room, name, number, cpf, userDisconnected, isWhatsapp, isBotOn } = state.chat.currentConversation;
  const { clientMessages, chatSelectCount } = state.chat;

  return {
    messages,
    room,
    name,
    number,
    cpf,
    userDisconnected,
    clientMessages,
    chatSelectCount,
    isWhatsapp,
    isBotOn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (msg, room) => dispatch(sendMessage(msg, room)),
    sendWhatsappMessage: (number, message, room) => dispatch(sendWhatsappMessage(number, message, room)),
    closeChat: (room, number) => dispatch(closeChat(room, number)),
    // showDialog: (title, message, actions) => dispatch(showDialog(title, message, actions)),
    // hideDialog: () => dispatch(hideDialog()),
    disableBotAndSendMessage: (room, number, message) => dispatch(disableBotAndSendMessage(room, number, message)),
    // toggleSidebar: (userInfo) => dispatch(toggleSidebar(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversation);