import styled from 'styled-components';
import { OPEN_SIZE, CLOSED_SIZE, COLORS } from '../../constants';
import { animated } from 'react-spring';

export const Avatar = styled(animated.img)`
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
  // box-shadow: ${props => props.ismobile && props.isopen ? 'none' : '0 0 10px #777'};
  z-index: 1;
  border-radius: ${CLOSED_SIZE.w/2}px;
  width: ${CLOSED_SIZE.w}px;
  height: ${CLOSED_SIZE.h}px;
`;

export const AppContainer = styled.div`
  height: ${props => (props.isOpen ? OPEN_SIZE.h : CLOSED_SIZE.h)}px;
  width: ${props => (props.isOpen ? OPEN_SIZE.w : CLOSED_SIZE.w)}px;
  -webkit-tap-highlight-color: transpareent;
`;

export const ChatContainer = styled(animated.div)`
  height: ${props => props.chatsize.h}px;
  width: ${props => props.chatsize.w}px;
  position: absolute;
  bottom: ${props => props.ismobile ? '0' : '10px'};
  right: ${props => props.ismobile ? '0' : '10px'};
  transform-origin: bottom right;
  background-color: ${COLORS.background};
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: ${props => props.ismobile ? '0' : '7px'};
  box-shadow: ${props => props.ismobile ? 'none' : '3px 3px 10px rgba(0,0,0,0.3)'};
  overflow-y: auto;
`;