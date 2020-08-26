import React, { useRef, useEffect } from 'react';
import { LoaderDots } from '@thumbtack/thumbprint-react';
import generateWatsonResponseFromAction from '../../utils/generateWatsonResponseFromAction';
import avatar from '../../assets/images/avatar_face.png';
import { useTransition } from 'react-spring';
import { BodyContainer, LoaderContainer, StyledLabel, UserMessageContainer, UserText, WatsonMessageContainer, WatsonText } from './styles';

const MessagesBody = (props) => {
  const { loading, ismobile, conversationStack, eventFunction } = props;
  const bottomScrollRef = useRef(null);

  const transitions = useTransition(conversationStack, (_, i) => i, {
    from: item => item.from === 'Usuário' ? { transform: 'translateX(10px)' }: { transform: 'translateX(-10px)' },
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
      if (element.from === 'Usuário') {
        return (
          <UserMessageContainer key={index} first={first}>
            {animatedResponse(index, props => <UserText latest={latest} {...props}>{element.text}</UserText>)}
          </UserMessageContainer>
        );
      } else { // nowadays we have only assistant and user message to render
        return element.outputs?.map((output, ind) => {
          const isImage = output.response_type && output.response_type !== 'text';
          // since watson doesn't recognize \n on html text, changes all to <br>
          const text = isImage ? _generateImageFromOutput(output) : output?.text?.replace(/\n/g, '<br>');
          return (
            <WatsonMessageContainer key={index + '' + ind} first={first} ismobile={ismobile}>
              {ismobile && <img src={avatar} style={{ height: 32, width: 32, position: 'absolute', left: 0, top: 0 }} alt="" />}
              {
                animatedResponse(index, props =>
                  latest
                    ? generateWatsonResponseFromAction(element.context, eventFunction, ismobile, props, index, _linkToEmailFromText(text), ind)
                    : <WatsonText
                      dangerouslySetInnerHTML={{ __html: _linkToEmailFromText(text) }}
                      ismobile={ismobile}
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
  ismobile: Boolean,
  conversationStack: Array,
  eventFunction: Function,
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