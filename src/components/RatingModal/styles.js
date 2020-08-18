import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export const ChatModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0, .7);
  display: flex;
  align-items: center;
`;

export const ChatModalInner = styled.div`
  margin: 0 auto;
  background-color: #eceff1;
  border-radius: 3px;
  padding: 35px 25px;
  position: relative;
`;

export const CloseButton = styled(CloseRoundedIcon)`
  position: absolute;
  top: 5px;
  right: 5px;
  color: #263238;
  cursor: pointer;
`;

export const ModalTitle = styled.p`
  margin: 0;
  color: #263238;
  font-size: 18px;
`;

export const ThumbsUp = styled(ThumbUpRoundedIcon)`
  cursor: pointer;
  font-size: 28px !important;
`;

export const ThumbsUpContainer = styled.div`
  color:  ${props => props.selected ? '#4caf50' : '#a0a0a0'};
  border-radius: 30px;
  padding: 10px;
  display: flex;
  cursor: pointer;
  background-color: ${props => props.selected ? '#4caf5033' : 'transparent'};
  &:hover {
    background-color: #4caf5033;
    color: #4caf50;
  }
`;

export const ThumbsDown = styled(ThumbDownRoundedIcon)`
  cursor: pointer;
  font-size: 28px !important;
`;

export const ThumbsDownContainer = styled.div`
  color: ${props => props.selected ? '#f44336' : '#a0a0a0'};
  border-radius: 30px;
  padding: 10px;
  display: flex;
  cursor: pointer;
  background-color: ${props => props.selected ? '#f4433633' : 'transparent'};
  &:hover {
    background-color: #f4433633;
    color: #f44336;
  }
`;

export const SendButton = styled(Button)`
  background-color:  ${props => props.disabled ? 'rgba(0, 0, 0, 0.12)' : '#00B6EF'} !important;
  color: ${props => props.disabled ? 'black' : 'white'} !important;
  margin: auto !important;
  display: flex !important;
`;