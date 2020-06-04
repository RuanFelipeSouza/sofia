import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const BASE_COLOR = '#4a148c';

export const ChatQueueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid lightgray;
  width: 35%;
  overflow: auto;
`;

export const EmptyChatQueueWrapper = styled(ChatQueueWrapper)`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const ChatQueueItemWrapper = styled.div`
  border-left: ${props => props.isCurrent ? `4px solid ${BASE_COLOR}` : null};
  box-shadow: ${props => props.isCurrent ? '0px 1px 5px 0px rgba(70, 20, 140, 0.2), 0px 2px 2px 0px rgba(70, 20, 140, 0.14), 0px 3px 1px -2px rgba(70, 20, 140, 0.12)' : null};
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
  padding: 0px 10px;
`;

export const ConversationWrapper = styled.div`
  overflow: auto;
  padding: 10px 10px 0px 10px;
  flex-grow: 1;
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
  flex-direction: column;
  background: rgba(170,141,205,1);
  justify-content: flex-start;
  padding: 10px 10px;
  cursor: pointer;
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
    border-radius: 50px;
  }
`;