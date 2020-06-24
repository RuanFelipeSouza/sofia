import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bool, func } from 'prop-types';

import * as Socketio from './../../services/Socketio';
import ChatConversation from './ChatConversation';
import ChatQueue from './ChatQueue';
import EmptyChat from './components/EmptyChat';
import chatImage from './../../assets/chat.png';
import Sidebar from './../../components/Sidebar';
import { fetchOngoingConversations } from './../../store/actions/chat';

const Wrapper = styled.div`
  display: flex;
  height: 95vh;
`;

class Chat extends Component {
  componentDidMount() {
    const { fetchOngoingConversations } = this.props;

    Socketio.connect();
    fetchOngoingConversations();
  }

  renderConversation() {
    const { isChatSelected } = this.props;

    if (isChatSelected) {
      return (
        <ChatConversation {...this.props} />
      );
    }

    return <EmptyChat
      image={chatImage}
      text='Nenhum chat selecionado'
    />;
  }

  render() {
    return (
      <Wrapper>
        <Sidebar />
        <ChatQueue />
        {this.renderConversation()}
      </Wrapper>
    );
  }
}

Chat.propTypes = {
  isChatSelected: bool.isRequired,
  fetchOngoingConversations: func.isRequired
};

const mapStateToProps = state => {
  return {
    isChatSelected: !!state.chat.currentConversation.room
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOngoingConversations: () => dispatch(fetchOngoingConversations())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);