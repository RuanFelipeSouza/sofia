import SendIcon from '@material-ui/icons/SendRounded';
import { COLORS } from '../../constants';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

export const Input = styled(TextareaAutosize)`
  background-color: transparent;
  border: none;
  flex: 1 1 auto;
  margin-left: 15px;
  margin-top: 12px;
  margin-bottom: 12px;
  height: 30px;
  font-size: 14px;
  font: 400 13.3333px Arial;
  resize: none;
  &:focus {
    outline: none;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #CCCCCC;
    font-size: 14;
  }
`;

export const InputContainer = styled.div`
  background-color: ${COLORS.background};
  flex: 0 1 auto;
  min-height: 48px;
  background: #FFFFFF;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.24), 0px 0px 2px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  display: flex;
  align-items: center;
  margin: 8px 8px 8px 8px;
`;

export const MaskedInput = styled(InputMask)`
  background-color: transparent;
  border: none;
  flex: 1 1 auto;
  margin-left: 15px;
  margin-top: 12px;
  margin-bottom: 12px;
  height: 16px;
  font-size: 14px;
  font: 400 13.3333px Arial;
  resize: none;
  &:focus {
    outline: none;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #CCCCCC;
    font-size: 14;
  }
`;

export const SendStyled = styled(SendIcon)`
  margin: 0 15px;
  height: 32px;
  width: 32px;
  color: ${props => props.disabled ? COLORS.disabled : COLORS.sendIcon };
  cursor: ${props => props.disabled ? 'auto' : 'pointer' };
`;