import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { arrayOf, shape, string, bool, func } from 'prop-types';
import { MessageBox, SystemMessage } from 'react-chat-elements';

import { ConversationWrapper, DisconnectionWrapper } from './elements';

class ChatDialog extends Component {
  componentDidMount() {
    setTimeout(() => this.scrollToBottom(), 1);
  }

  componentDidUpdate() {
    setTimeout(() => this.scrollToBottom(), 1);
  }

  render() {
    const { messages, userName } = this.props;

    return (
      <ConversationWrapper>
        {Object.keys(messages).map(key => {
          return this.renderMessage(userName, messages[key], key);
        })}
        {this.renderSystemMessage()}
        <div ref={el => { this.messagesEnd = el; }} />
      </ConversationWrapper>
    );
  }

  renderSystemMessage() {
    const { closeChat, room, userNumber, userDisconnected } = this.props;

    if (userDisconnected) {
      return (
        <DisconnectionWrapper>
          <SystemMessage text='Usuário se desconectou' />
          <hr />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // className={classes.submit}
            // disabled={loading}
            onClick={() => closeChat(room, userNumber)}
            style={{ height: 46 }}
          > Encerrar Atendimento</Button>
        </DisconnectionWrapper>
      );
    }

    return null;
  }

  renderMessage(userName, { origin, status, text, date }, k) {
    const fixedStatus = status === 'delivered' ? 'received' : status;
    return (
      <div key={k}>
        <MessageBox
          position={origin === 'agent' ? 'right' : 'left'}
          status={origin === 'agent' ? fixedStatus : ''}
          type={'text'}
          text={text}
          title={origin === 'agent' ? 'Você disse:' : `${userName} disse:`}
          dateString={date}
        />
      </div>
    );
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }
}

ChatDialog.propTypes = {
  messages: arrayOf(shape({
    origin: string.isRequired,
    text: string.isRequired,
    date: string.isRequired,
    status: string
  })),
  userDisconnected: bool,
  userName: string.isRequired,
  userNumber: string,
  room: string.isRequired,
  closeChat: func.isRequired
};

ChatDialog.defaultProps = {
  userDisconnected: false
};

export default ChatDialog;
