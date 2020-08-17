import { COLORS } from '../../constants';
import styled from 'styled-components';
import CloseIconI from '@material-ui/icons/KeyboardArrowDownRounded';

export const CloseIcon = styled(CloseIconI)`
  margin-right: 15px;
  cursor: pointer;
  height: 28px !important;
  width: 28px !important;
  color: ${COLORS.minimizeIcon};
`;

export const HeaderData = styled.div`
  flex: 1 1 auto;
  margin-left: ${props => props.ismobile ? '60' : '65'}px;
  font-size: ${props => props.ismobile ? '18' : '16'}px;
  color: white;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  background-color: ${COLORS.header};
  box-shadow: 0 0 7px rgba(0,0,0,0.5), inset 0 0px 20px rgba(0,0,0,0.1);
  z-index: 10;
  cursor: pointer;
  display: flex;
  flex: 0 1 ${props => props.ismobile ? '56' : '46'}px;
  align-items: center;
  min-height: ${props => props.ismobile ? '56' : '46'}px;

`;