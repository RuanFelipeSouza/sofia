import React from 'react';
import { WatsonText } from '../components/MessagesBody/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';
import { sendMessage } from '../store/actions/message';
import { COLORS } from '../constants';
import { animated } from 'react-spring';
import PaginatedTable from '../components/PaginatedTable/PaginatedTable';

const StyledSelect = styled(Select)`
  margin-left: ${(props) => (props.ismobile ? '42' : '10')}px;
  margin-top: 10px;
  width: ${(props) =>
    props.ismobile ? 'calc(100% - 40px)' : 'calc(100% - 10px)'};
  & > div:focus {
    background-color: transparent !important;
  }
`;

const SelectSubtitle = styled.span`
  font-size: 14px;
  font-style: italic;
  margin-top: -5px;
  display: block;
  margin-bottom: 5px;
`;

const StyledButton = styled.div`
  width: 100%;
  background-color: white;
  min-height: 40px;
  padding: 10px;
  border: ${COLORS.watsonBalloon} 1px solid;
  border-top: none;
  box-sizing: border-box;
  cursor: pointer;
  color: black;
  border-radius: ${(props) => (props.latest ? '0 0 15px 15px' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  &:hover {
    background-color: ${COLORS.watsonBalloon}22;
  }
`;

const ButtonContainer = styled(animated.div)`
  margin-top: 0px;
  width: ${(props) =>
    props.ismobile ? 'calc(100% - 40px)' : 'calc(100% - 10px)'};
  margin-left: ${(props) => (props.ismobile ? '42' : '10')}px;
`;

const HiddenMenuItem = styled(MenuItem)`
  display: none !important;
`;

const generateWatsonResponseFromAction = (
  watsonResponse,
  dispatch,
  ismobile,
  props,
  key,
  text,
  ind
) => {
  if (!watsonResponse?.context?.action || !text.includes('<action>')) {
    return (
      <WatsonText
        latest={1}
        hidebar={ind !== 0 ? 1 : 0}
        ismobile={ismobile ? 1 : 0}
        dangerouslySetInnerHTML={{ __html: text }}
        {...props}
      />
    );
  }

  const [textBeforeAction, textAfterAction] = text?.split('<action>');

  let response;
  switch (watsonResponse?.context?.action) {
    case 'generateButtons':
      response = _handleGenerateButtons(
        watsonResponse?.context?.buttonLabels,
        dispatch,
        ismobile,
        props
      );
      break;
    case 'generateSelect':
      response = _handleGenerateSelect(
        watsonResponse?.context?.selectContent,
        dispatch,
        ismobile,
        watsonResponse?.context?.selectSubtitles
      );
      break;
    case 'generateTable':
      response = _handleGenerateTable(
        watsonResponse?.context?.tableContent,
        props
      );
      break;
    default:
      response = { action: null };
      break;
  }
  const { action, textStyle } = response;

  return (
    <div key={key}>
      <WatsonText
        dangerouslySetInnerHTML={{ __html: textBeforeAction }}
        latest={1}
        ismobile={ismobile ? 1 : 0}
        key='firstMessage'
        {...props}
        style={{ ...props.style, ...textStyle }}
      />
      {action}
      {textAfterAction && (
        <WatsonText
          dangerouslySetInnerHTML={{ __html: textAfterAction }}
          latest={1}
          ismobile={ismobile ? 1 : 0}
          hidebar={1}
          {...props}
          key='secondMessage'
        />
      )}
    </div>
  );
};
generateWatsonResponseFromAction.propTypes = {
  style: Object,
};
export default generateWatsonResponseFromAction;

const _handleGenerateButtons = (buttonLabels, dispatch, ismobile, props) => {
  const labels = buttonLabels.split(',');
  const length = labels.length - 1;

  return {
    action: (
      <ButtonContainer
        ismobile={ismobile ? 1 : 0}
        style={{ transform: props.style.transform }}>
        {labels.map((element, index) => (
          <StyledButton
            onClick={() => dispatch(sendMessage(element))}
            key={index}
            latest={index === length}>
            {element}
          </StyledButton>
        ))}
      </ButtonContainer>
    ),
    textStyle: {
      borderRadius: '0 15px 0 0',
      width: ismobile ? 'calc(100% - 70px)' : 'calc(100% - 40px)',
    },
  };
};

const _handleGenerateSelect = (
  selectContent,
  dispatch,
  isMobile,
  selectSubtitles
) => {
  return {
    action: (
      <StyledSelect
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value=''
        displayEmpty
        ismobile={isMobile ? 1 : 0}
        onChange={(e) => dispatch(sendMessage(e.target.value))}>
        <HiddenMenuItem value='' disabled key={-1} hidden>
          Selecione uma opção
        </HiddenMenuItem>
        {selectContent.map((element, index) => (
          <MenuItem value={element.value} key={index}>
            <div>
              {element.text}
              <br />
              <SelectSubtitle>
                {selectSubtitles && selectSubtitles[index]}
              </SelectSubtitle>
            </div>
          </MenuItem>
        ))}
      </StyledSelect>
    ),
  };
};

const _handleGenerateTable = (tableContent, props) => {
  return {
    action: (
      <animated.div style={{ transform: props.style.transform }}>
        <PaginatedTable rows={tableContent} />
      </animated.div>
    ),
  };
};
