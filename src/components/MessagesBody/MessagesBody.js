import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LoaderDots } from '@thumbtack/thumbprint-react';
import generateWatsonResponseFromAction from '../../utils/generateWatsonResponseFromAction';
import avatar from '../../assets/images/avatar_face.png';
import { useTransition } from 'react-spring';
import { BodyContainer, LoaderContainer, StyledLabel, UserMessageContainer, UserText, WatsonMessageContainer, WatsonText } from './styles';

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
      key === i && child({ style, key })
    );
  };

  const scrollToBottom = () => {
    bottomScrollRef.current.scrollTop = bottomScrollRef.current.scrollHeight;
  };

  useEffect(scrollToBottom, [conversationStack]);

  const generateConversation = () => {
    return conversationStack.map((element, index, array) => {
      const latest = index === array.length - 1 || index === array.length - 2;
      const first = index === 0;
      if (element.userText) {
        return (
          <UserMessageContainer key={index} first={first}>
            {animatedResponse(index, props => <UserText latest={latest ? 1 : 0} {...props}>{element.userText.input.text}</UserText>)}
          </UserMessageContainer>
        );
      } else {
        const outputs = element.watsonResponse.output.generic;

        return outputs?.map((output, ind) => {
          const isImage = output.response_type && output.response_type !== 'text';
          // since watson doesn't recognize \n on html text, changes all to <br>
          const text = isImage ? _generateImageFromOutput(output) : output?.text?.replace(/\n/g, '<br>');
          return (
            <WatsonMessageContainer key={index + '' + ind} first={first} ismobile={ismobile ? 1 : 0}>
              {ismobile && <img src={avatar} style={{ height: 32, width: 32, position: 'absolute', left: 0, top: 0 }} alt="" />}
              {
                animatedResponse(index, props =>
                  latest
                    ? generateWatsonResponseFromAction(element.watsonResponse, dispatch, ismobile, props, index, _linkToEmailFromText(text), ind)
                    : <WatsonText
                      dangerouslySetInnerHTML={{ __html: _linkToEmailFromText(text) }}
                      ismobile={ismobile ? 1 : 0}
                      {...props}
                    />
                )
              }
            </WatsonMessageContainer>
          );
        });
      }
    });
  };

  return (
    <StyledLabel htmlFor="userInput" ref={bottomScrollRef}>
      <BodyContainer >
        {generateConversation()}
        {loading && (
          <LoaderContainer>
            <LoaderDots size="small" theme="muted" />
          </LoaderContainer>
        )}
      </BodyContainer>
    </StyledLabel>
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