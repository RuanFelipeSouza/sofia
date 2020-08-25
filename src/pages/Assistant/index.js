import React, { useEffect, useState } from 'react';
import avatarImg from '../../assets/images/avatar.png';
import { useSelector, useDispatch } from 'react-redux';
import {
  openContainer,
  closeContainer,
  setMobile,
  closeModal,
  showRatingModal,
  closeRatingModal,
} from './../../store/actions/container';
import { setInitialMessage, sendMessage } from './../../store/actions/message';
import { OPEN_SIZE, CLOSED_SIZE } from '../../constants';
import { useSpring } from 'react-spring';
import UserEntry from '../../components/UserEntry/UserEntry';
import MessagesBody from '../../components/MessagesBody/MessagesBody';
import Header from '../../components/ChatHeader/ChatHeader';
import Modal from '../../components/Modal/Modal';
import RatingModal from '../../components/RatingModal/RatingModal';
import { animated } from 'react-spring';
import { AppContainer, Avatar, ChatContainer } from './styles';

const App = () => {
  const isChatOpen = useSelector((state) => state.container.open);
  const [animate, setAnimate] = useState(false);
  const loading = useSelector((state) => state.message.loading);
  const conversationStack = useSelector(
    (state) => state.message.conversationStack
  );
  const isModal = useSelector((state) => state.container.modal);
  const hasRatingModal = useSelector((state) => state.container.ratingModal);
  const hasRated = useSelector((state) => state.container.hasRated);
  const [isMobile, setIsMobile] = useState(false);

  const [chatSize, setChatSize] = useState(OPEN_SIZE);
  const dispatch = useDispatch();

  const fadeIn = useSpring({
    opacity: hasRatingModal,
    config: { duration: 150 },
  });

  const chatGrow = useSpring({
    transform: `scale(${animate})`,
    config: { duration: 300 },
    onFrame: ({ transform }) => {
      if (
        transform.split('(')[1].slice(0, -1) < 0.55 &&
        !animate &&
        isChatOpen
      ) {
        dispatch(closeContainer());
      }
    },
  });

  const mobileAvatar = {
    right: animate ? chatSize.w - 70 : 10,
    bottom: animate ? chatSize.h - 67.5 : 10,
    transform: `scale(${animate ? 0.6 : 1})`,
  };
  const desktopAvatar = {
    right: animate ? OPEN_SIZE.w - 35 : 10,
    bottom: animate ? OPEN_SIZE.h - 45 : 10,
    transform: `scale(${animate ? 1.2 : 1})`,
  };
  const avatarHero = useSpring({
    ...(isMobile ? mobileAvatar : desktopAvatar),
    config: { duration: 300 },
  });

  const onCloseModal = () => {
    dispatch(closeModal({ fullscreen: isMobile }));
  };
  const onElementTrigger = (msg)=>{
    dispatch(sendMessage(msg));
  };
  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data.m === 'r') {
        dispatch(closeContainer({ w: CLOSED_SIZE.w, h: CLOSED_SIZE.h }));
        dispatch(setInitialMessage());
        if (e.data.w <= 724) {
          dispatch(setMobile({ w: CLOSED_SIZE.w, h: CLOSED_SIZE.h }));
          setChatSize({ w: e.data.w, h: e.data.h });
          setIsMobile(true);
        }
      }
    });
  }, [dispatch, isMobile]);

  const handleAvatarClick = () => {
    if (isChatOpen) {
      if (hasRated) {
        _closeChat();
      } else if (hasRatingModal) {
        dispatch(closeRatingModal());
        _closeChat();
      } else if (conversationStack?.length > 2) {
        dispatch(showRatingModal());
      } else {
        _closeChat();
      }
    } else if (isMobile) {
      dispatch(openContainer({ w: chatSize.w, h: chatSize.h, f: true }));
      setAnimate(true);
    } else {
      dispatch(openContainer({ w: OPEN_SIZE.w + 48, h: OPEN_SIZE.h + 88 }));
      setAnimate(true);
    }
  };

  const _closeChat = () => setAnimate(false);
  return (
    <AppContainer className="App" id="app" isOpen={isChatOpen}>
      <Avatar
        src={avatarImg}
        alt={'Chat Bot Avatar'}
        onClick={handleAvatarClick}
        ismobile={isMobile}
        isopen={isChatOpen}
        style={avatarHero}
      />
      <ChatContainer
        style={chatGrow}
        ismobile={isMobile}
        chatsize={chatSize}
      >
        <Header ismobile={isMobile} handleHeaderClick={handleAvatarClick} />
        <MessagesBody
          loading={loading}
          ismobile={isMobile}
          conversationStack={conversationStack}
          eventFunction={onElementTrigger}
        />
        <UserEntry loading={loading} />
        {hasRatingModal && (
          <animated.div style={fadeIn}>
            <RatingModal isMobile={isMobile} closeChat={_closeChat} />
          </animated.div>
        )}
      </ChatContainer>
      <Modal open={isModal} onClose={onCloseModal} />
    </AppContainer>
  );
};

export default App;
