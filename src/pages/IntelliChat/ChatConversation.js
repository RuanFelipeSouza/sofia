import React, { Component, useState } from 'react';
import { arrayOf, string, func, object, bool, number } from 'prop-types';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';

import './components/chat.css';
import ChatDialog from './components/ChatDialog';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import { ChatWrapper } from './components/elements';
import {
  sendMessage,
  sendWhatsappMessage,
  closeChat,
  disableBotAndSendMessage,
  changeBotState
} from '../../store/actions/chat';
import { showDialog, hideDialog } from '../../store/actions/layout';
import AlertDialog from '../../components/Alert';

class ChatConversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        visible: false,
        title: '',
        dialog: '',
        actions: [],
      },
    };
  }

  // handleSendMessage(message) {
  //   const { sendMessage, room } = this.props;
  //   sendMessage(message, room);
  // }

  // TODO Mostrar alert ao enviar mensagem quando o bot está ligado
  hideAlert() {
    this.setState({ alert: {} });
  }
  handleSendMessage(message, isBotOn) {
    const {
      sendMessage,
      showDialog,
      room,
      disableBotAndSendMessage,
    } = this.props;
    if (isBotOn) {
      const title = 'Atenção!';
      const dialogMessage =
        'Você está tentando enviar mensagem para um usuário que está com atendimento automático habilitado. O que deseja fazer?';
      const actions = [
        { label: 'Não enviar a mensagem', onClick: () => this.hideAlert() },
        {
          label: 'Desabilitar o robô e enviar a mensagem',
          onClick: () => {
            disableBotAndSendMessage(room, number, message);
            this.hideAlert();
          },
        },
      ];
      const alertProperties = {
        visible: true,
        title: title,
        dialog: dialogMessage,
        actions: actions,
      };
      this.setState({ alert: alertProperties });
      showDialog(title, dialogMessage, actions);
    } else {
      sendMessage(message, room);
    }
  }

  // handleSendWhatsappMessage(number, message) {
  //   const { sendWhatsappMessage, room }  this.props;

  //   sendWhatsappMessage(number, message, room);
  // }

  formatNumber(number) {
    return number
      ? number.replace(
        /(\D*)(\d{2})*(\d{2})(\d{1})*(\d{4})(\d{4})/,
        '($3) $4 $5-$6'
      )
      : '';
  }

  render() {
    const {
      messages,
      clientMessages,
      room,
      name,
      number,
      cpf,
      userDisconnected,
      closeChat,
      changeBotState,
      chatSelectCount,
      isWhatsapp,
      isBotOn,
    } = this.props;

    // const userInfo = {
    //   name,
    //   number: this.formatNumber(number),
    //   cpf,
    //   conversationId: room,
    //   totalMessages: messages.length,
    //   showInteractionCost: isWhatsapp
    // };

    const token = localStorage.getItem('token');
    const { isSupervisor } = jwtDecode(token);
    return (
      <ChatWrapper>
        <ChatHeader
          title={name}
          subtitle={isWhatsapp ? this.formatNumber(number) : cpf}
          closeChat={() => closeChat(room, number)}
          isBotOn={isBotOn}
          changeBotState={()=>changeBotState(room, number, !isBotOn)}
          // onClick={() => toggleSidebar(userInfo)}
        />
        {this.state.alert.visible && (
          <AlertDialog
            visible={this.state.alert.visible}
            title={this.state.alert.title}
            dialogMessage={this.state.alert.dialog}
            actions={this.state.alert.actions}
          />
        )}
        <ChatDialog
          messages={room ? messages : clientMessages}
          userDisconnected={userDisconnected}
          room={room}
          closeChat={closeChat}
          userName={name}
          userNumber={number}
        />
        <ChatInput
          sendMessage={(message) => this.handleSendMessage(message, isBotOn)}
          chatSelectCount={chatSelectCount}
          isDisabled={userDisconnected || isSupervisor}
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
  changeBotState: func.isRequired,
  isBotOn: bool,
  toggleSidebar: func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    messages,
    room,
    name,
    number,
    cpf,
    userDisconnected,
    isWhatsapp,
    isBotOn,
  } = state.chat.currentConversation;
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
    isBotOn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeBotState: (room, number, botState) =>
      dispatch(changeBotState(room, number, botState)),
    sendMessage: (msg, room) => dispatch(sendMessage(msg, room)),
    sendWhatsappMessage: (number, message, room) =>
      dispatch(sendWhatsappMessage(number, message, room)),
    closeChat: (room, number) => dispatch(closeChat(room, number)),
    showDialog: (title, message, actions) =>
      dispatch(showDialog(title, message, actions)),
    hideDialog: () => dispatch(hideDialog()),
    disableBotAndSendMessage: (room, number, message) =>
      dispatch(disableBotAndSendMessage(room, number, message)),
    // toggleSidebar: (userInfo) => dispatch(toggleSidebar(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversation);
