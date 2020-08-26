import styled from 'styled-components';
import { COLORS } from '../../constants';
import { animated } from 'react-spring';

export const LoaderContainer = styled.div`
  display: inline-block;
  margin-bottom: 15px;
  margin-left: 20px;
`;

export const StyledLabel = styled.label`
  display: block;
  flex: 1 1 auto;
  overflow-y: auto;
`;

export const BodyContainer = styled.div`
  background-color: ${props=> props.backgroundColor || COLORS.background};
  width: 100%;
  flex: 1 1 auto;
  overflow-y: auto;
  background: ${props=> props.backgroundColor || COLORS.background};
`;

export const UserText = styled(animated.p)`
  font-size: 14px;
  letter-spacing: 0.015rem;
  color: ${props => props.latest ? COLORS.userTextColor : COLORS.userDisabledTextColor};
  background-color: ${COLORS.userBalloon};
  filter: ${props => (props.latest ? 'none' : 'grayscale(0.4) opacity(0.5);')};
  display:inline-block;
  padding: 8px 15px;
  border-radius: 15px 0 15px 15px;
  margin-bottom: 0;
  margin-top: 0;
  overflow-wrap: break-word;
  max-width: calc(100% - 30px);
`;

export const UserMessageContainer = styled.div`
  overflow-wrap: break-word;
  text-align: right;
  margin-right: 15px;
  margin-left: 45px;
  margin-bottom: 15px;
  margin-top: ${props => (props.first ? '30px' : '0')};
`;

export const WatsonMessageContainer = styled.div`
  overflow-wrap: break-word;
  margin-left: 10px;
  margin-right: 45px;
  margin-bottom: 15px;
  position: relative;
  margin-top: ${props => {
    if (props.first) {
      return props.ismobile ? '16px' : '32px';
    } else return '0';
  }};
`;

export const WatsonText = styled(animated.p)`
  margin-left: ${props => (props.ismobile ? '42' : '10')}px;
  font-size: 14px;
  letter-spacing: 0.015rem;
  margin-bottom: 0;
  margin-top: 0;
  border-radius: 0 15px 15px 15px;
  padding: 8px 15px;
  display: inline-block;
  overflow-wrap: break-word;
  max-width: calc(100% - 30px);
  background-color: ${props => (props.latest ? COLORS.watsonBalloon : '#B5B5B5')};
  color: ${props => (props.latest ? COLORS.watsonTextColor : COLORS.watsonDisabledTextColor)};
  &:before {
    display: inline-block;
    content: "";
    color: transparent;
    background: ${props => {
    if (props.ismobile) return 'transparent';
    return (props.latest && !props.hidebar ? COLORS.watsonTick : 'transparent');
  }};
    border-radius: 50px;
    width: 4px;
    height: 22px;
    position: absolute;
    left: -10px;
    top: 0;
  }
`;