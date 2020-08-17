import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LoaderDots } from '@thumbtack/thumbprint-react';
import generateWatsonResponseFromAction from '../../utils/generateWatsonResponseFromAction';
import avatar from '../../assets/images/avatar_face.png';
import {useTransition} from 'react-spring';
import * as S from './styles';

const MessagesBody = ({ loading, ismobile }) => {
  const dispatch = useDispatch();
  const bottomScrollRef = useRef(null);
  const conversationStack = useSelector(
    state => state.message.conversationStack
  );

  const transitions = useTransition(conversationStack, (_, i) => i, {
    from: item => item.watsonResponse ? { transform: 'translateX(-10px)' } : { transform: 'translateX(10px)' },
    enter: { transform: 'translateX(0px)' },
  });

  const animatedResponse = (i, child) => {
    return transitions.map(({ props: style, key }) => 
      key === i && child({style, key})
    );
  };
  
  const scrollToBottom = () => {
    bottomScrollRef.current.scrollTop = bottomScrollRef.current.scrollHeight;
  };

  useEffect(scrollToBottom, [conversationStack]);

  const generateConversation = () => {
    return conversationStack.map((e, i, a) => {
      const latest = i === a.length - 1 || i === a.length - 2;
      const first = i === 0;
      if (e.userText) {
        return (
          <S.UserMessageContainer key={i} first={first}>
            {animatedResponse(i, props => <S.UserText latest={latest ? 1 : 0} {...props}>{e.userText.input.text}</S.UserText>)}
          </S.UserMessageContainer>
        );
      } else {
        const outputs = e.watsonResponse.output.generic;
        
        return outputs?.map((output, ind) => {
          const isImage = output.response_type && output.response_type !== 'text';
          // since watson doesn't recognize \n on html text, changes all to <br>
          const text = isImage ? _generateImageFromOutput(output) : output?.text?.replace(/\n/g, '<br>');
          return (
            <S.WatsonMessageContainer key={i+''+ind} first={first} ismobile={ismobile ? 1 : 0}>
              {ismobile && <img src={avatar} style={{height: 32, width: 32, position: 'absolute', left: 0, top: 0}} alt="" />}
              {
                animatedResponse(i, props =>
                  latest
                    ? generateWatsonResponseFromAction(e.watsonResponse, dispatch, ismobile, props, i, _linkToEmailFromText(text), ind)
                    : <S.WatsonText
                      dangerouslySetInnerHTML={{ __html: _linkToEmailFromText(text) }}
                      ismobile={ismobile ? 1 : 0}
                      {...props}
                    />
                )
              }
            </S.WatsonMessageContainer>
          );
        });
      }
    });
  };

  return (
    <S.StyledLabel htmlFor="userInput" ref={bottomScrollRef}>
      <S.BodyContainer >
        {generateConversation()}
        {loading && (
          <S.LoaderContainer>
            <LoaderDots size="small" theme="muted" />
          </S.LoaderContainer>
        )}
      </S.BodyContainer>
    </S.StyledLabel>
  );
};
MessagesBody.propTypes = {
  loading: Boolean,
  ismobile: Boolean
};
export default MessagesBody;

const _generateImageFromOutput = (output) => {
  return `
  <h3 style="text-align: center; margin: 8px;">${output?.title}</h3>
  <img src="${output?.source}" style="max-width: 100%; margin-bottom: 10px; width: ${output.width}; height: ${output.height}" /><br>
  <span>${output?.description}</span>
  `;
};

const _linkToEmailFromText = (text) => {
  const regex = /((?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/;
  const match = text?.replace(regex, '<a href="mailto:$1">$1</a>');

  return match;
};