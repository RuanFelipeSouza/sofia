import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bool, func } from 'prop-types';

import * as Socketio from './../../services/Socketio';
import ChatConversation from './ChatConversation';
import ChatQueue from './ChatQueue';
import EmptyChat from './components/EmptyChat';
import Sidebar from './../../components/Sidebar';
import Paper from '@material-ui/core/Paper';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import { fetchOngoingConversations } from './../../store/actions/chat';
import Typography from '@material-ui/core/Typography';
import { BASE_COLOR } from '../../services/constants';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px;
  padding-top: 25px;
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  background-color: #FAFAFA;
  z-index: 5;
`;

const CustomPaper = styled(Paper)`
  display: flex;
  box-sizing: border-box;
  flex: 1;
  margin-top: 10px;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  height: 150px;
  background-color: ${BASE_COLOR};
  top: 0;
  left: 240px;
  width: calc(100% - 240px);
  z-index: -10;
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
      text='Selecione um chat ao lado para ver a conversa'
    />;
  }

  render() {
    return (
      <Wrapper>
        <Sidebar />
        <Container>
          <Background />
          <div style={{ display: 'flex', color: 'white' }}>
            <Typography variant="h4">INTELLICHAT</Typography>
            <ChatRoundedIcon style={{ margin: 'auto 20px', fontSize: 24 }} />
          </div>
          <CustomPaper elevation={5}>
            <ChatQueue />
            {this.renderConversation()}
          </CustomPaper>
        </Container>
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