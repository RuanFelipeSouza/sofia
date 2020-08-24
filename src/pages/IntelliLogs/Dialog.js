import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { object, string, oneOfType } from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import * as moment from 'moment';
import * as parse from 'html-react-parser';
import { WatsonText, BodyContainer, StyledLabel, UserMessageContainer } from '../../components/MessagesBody/styles';

const useStyles = makeStyles((theme) => ({
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 5%'
  },
  assistantLine: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end'
  },
  assistantMessage: {
    marginTop: '1.5%',
    marginBottom: '1.5%',
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.light,
    padding: '0 3%',
    maxWidth: '60%',
    minWidth: '25%'
  },
  userLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  userMessage: {
    marginTop: '1.5%',
    marginBottom: '1.5%',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    padding: '0 3%',
    maxWidth: '60%',
    minWidth: '25%'
  },
  userAvatar: {
    margin: '1.5% 2%',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
  },
  assistantAvatar: {
    margin: '1.5% 2%',
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.dark,
  },
  userMessageDatetime: {
    color: theme.palette.primary.contrastText,
    margin: '0',
    textAlign: 'right'
  },
  assistantMessageDatetime: {
    color: theme.palette.secondary.contrastText,
    margin: '0',
    textAlign: 'right'
  },
  innerImage: {
    maxHeight: '500px',
  }
}));

function formatMessage(msg) {
  if (msg) {
    msg = msg.replace(/(\*)([^*]*)(\*)/g, '<b>$2</b>'); //coloca negrito na mensagem, substitui *texto* por <b>texto</b>
    msg = msg.replace('\n', '<br/>'); //coloca quebra de linha na mensagem
    return parse(msg);
  }
  return '';
}

const createMessage = (props, classes) =>
  <>

    <UserMessageContainer className={classes.assistantMessage} >
      <WatsonText
        dangerouslySetInnerHTML={{ __html: formatMessage(props.text) }}
        {...props}
      />
    </UserMessageContainer>
    {/* <p>
      <b>{props.from}</b><br />
      {props.media && (<> <img className={classes.innerImage} src={props.media} alt={''} /> <br /> </>)}
      {formatMessage(props.text)}
    </p> */}
  </>;

createMessage.propTypes = {
  from: string,
  media: string,
  text: string,
  date: string,
};

export default function Dialog(props) {
  const classes = useStyles();
  const { dialog } = props;

  return (
    // <ChatContainer chatsize={{ w: 450, h: 550 }}>
    <StyledLabel htmlFor="userInput">
      <BodyContainer>
        <Paper className={classes.conversation}>
          {dialog.messages && dialog.messages?.map((row) => {
            if (row.from === 'Assistente')
              return <div key={row._id} className={classes.assistantLine}>
                <Avatar className={classes.assistantAvatar}>A</Avatar>
                {/* <Paper className={classes.assistantMessage}> */}
                {createMessage(row, classes)}
                <h5 className={classes.assistantMessageDatetime}>{moment(row.date).format('DD/MM/YYYY HH:mm')}</h5>
                {/* </Paper> */}
              </div>;
            return <div key={row._id} className={classes.userLine}>
              <Avatar className={classes.userAvatar}>{row.from?.charAt()}</Avatar>
              {/* <Paper className={classes.userMessage}> */}
              {createMessage(row, classes)}
              <h5 className={classes.userMessageDatetime}>{moment(row.date).format('DD/MM/YYYY HH:mm')}</h5>
              {/* </Paper> */}
            </div>;
          })}
        </Paper>
      </BodyContainer>
    </StyledLabel>
    // </ChatContainer>
  );
}

Dialog.propTypes = {
  dialog: oneOfType([object, string]),
};