import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const BASE_COLOR = '#4a148c';

export const ChatQueueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid lightgray;
  width: 35%;
  z-index: 5;
`;

export const EmptyChatQueueWrapper = styled(ChatQueueWrapper)`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const ChatQueueItemWrapper = styled.div`
  border-left: ${props => props.isCurrent ? `4px solid ${BASE_COLOR}` : null};
  z-index: ${props => props.isCurrent ? 1 : null};
  color: ${props => props.isCurrent ? BASE_COLOR : ''};
  font-weight: ${props => props.isCurrent ? 'bold' : ''};
`;

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputWrapper = styled.div`
  padding: 10px 20px;
  z-index: 2;
  box-shadow: 5px 0px 8px #CCC;
  background-color: #F7F7F7;
`;

export const ConversationWrapper = styled.div`
  overflow: auto;
  padding: 10px;
  flex-grow: 1;
  background-color: rgba(240, 239, 245, 0.95);
`;

export const DisconnectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const EmptyChatWrapper = styled(ChatWrapper)`
  justify-content: center;
  align-items: center;
`;

export const EmptyTitle = styled.h3`
  color: gray;
  font-weight: 500;
`;

export const EmptyText = styled.p`
  color: gray;
  font-weight: 200;
  padding-top: 10px;
`;

export const ChatHeaderWrapper = styled.div`
  display: flex;
  background: rgba(170,141,205,1);
  padding: 10px 10px;
  cursor: pointer;
  height: 70px;
  min-height: 70px;
  box-sizing: border-box;
`;

export const ChatHeaderTitle = styled.p`
  font-weight: 600;
  margin: 0px;
  color: white;
  font-size: 1.2em;
`;

export const ChatHeaderSubtitle = styled(ChatHeaderTitle)`
  font-weight: 400;
  font-size: 0.8em;
`;

export const RoundTextField = styled(TextField)`
  fieldset {
    border-radius: 15px;
  }
  margin: 0 !important;
  border-radius: 15px;
  background-color: white;
`;

export const ChatHeader = styled.div`
  height: 70px;
  min-height: 70px;
  background-color: #EDEDED;
  display: flex;
  align-items: center;
  padding-left: 15px;
`;

export const ChatHeaderTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const ChatHeaderSearch = styled.div`
  height: 45px;
  min-height: 45px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0px 0px 3px #DDD;
  z-index: 1;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;