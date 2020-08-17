import React, { useState } from 'react';
import * as S from './styles';

import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, sendSocketMessage } from '../../store/actions/message';

const UserEntry = () => {
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();
  const placeholder = useSelector(state => state.input.placeholder);
  const isEnabled = useSelector(state => state.input.enabled);
  const mask = useSelector(state => state.message.actualContext.mask);
  const isBotOn = useSelector(state => state.message.actualContext.isBotOn);
  
  const handleKeyDown = e => {
    if (e.keyCode === 13) onSendMessage();
  };

  const onSendMessage = () => {
    inputText.replace();
    if (!inputText || !isEnabled) return;
    isBotOn === false ? dispatch(sendSocketMessage(inputText)): dispatch(sendMessage(inputText));
    setInputText('');
  };

  const handleOnChange = e => {
    setInputText(e.target.value.replace(/\r?\n|\r|\t/g, ' '));
  };

  return (
    <label htmlFor="userInput">
      <S.InputContainer>
        {
          mask ? (
            <S.MaskedInput
              mask={mask}
              disabled={!isEnabled}
              value={inputText}
              placeholder={placeholder}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              ref={input => input && input.focus()}
              alwaysShowMask={false}
              maskPlaceholder={'_'}
              id="userInput"
            />
          ) : (
            <S.Input
              rowsMax={3}
              wrap={'hard'}
              cols={40}
              disabled={!isEnabled}
              placeholder={placeholder}
              value={inputText}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              ref={input => input && input.focus()}
              id="userInput"
            />
          )
        }
        <S.SendStyled onClick={onSendMessage} disabled={!isEnabled} />
      </S.InputContainer>
    </label>
  );
};

export default UserEntry;