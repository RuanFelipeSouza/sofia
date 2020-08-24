import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple, green } from '@material-ui/core/colors';
import * as moment from 'moment';
import * as parse from 'html-react-parser';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 5%',
  },
  assistantLine: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
  userLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  message: {
    marginTop: '1.5%',
    marginBottom: '1.5%',
    padding: '0 3%',
    maxWidth: '60%',
    minWidth: '25%',
  },
  teacherColor: {
    backgroundColor: '#DBF6C6',
  },
  studentColor: {
    backgroundColor: '#FFFFFA',
  },
  orangeAvatar: {
    margin: '1.5% 2%',
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: '1.5% 2%',
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  greenAvatar: {
    margin: '1.5% 2%',
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
  },
  messageDatetime: {
    color: '#888',
    margin: '0',
    textAlign: 'right',
  },
  innerImage: {
    maxHeight: '500px',
  },
}));

function formatMessage(msg) {
  if (msg) {
    msg = msg.replace(/(\*)([^*]*)(\*)/g, '<b>$2</b>'); //coloca negrito na mensagem, substitui *texto* por <b>texto</b>
    msg = msg.replace('\n', '<br/>'); //coloca quebra de linha na mensagem
    return parse(msg);
  }
  return '';
}

const createMessage = (props, classes) => (
  <>
    <p>
      <b>{props.from}</b>{' '}
      {props.to && (
        <>
          {' '}
          para <b>{props.to}</b>
        </>
      )}
      <br />
      {props.media && (
        <>
          {' '}
          <img className={classes.innerImage} src={props.media} alt={''} /> <br />{' '}
        </>
      )}
      {formatMessage(props.text)}
    </p>
    <h5 className={classes.messageDatetime}>{moment(props.date).format('DD/MM/YYYY HH:mm')}</h5>
  </>
);

export default function Dialog(props) {
  const classes = useStyles();
  const { conversa } = props;
  if (!conversa.history) conversa.history = conversa.conversa;

  return (
    <Paper className={classes.conversation}>
      {conversa.history &&
        conversa.history?.map((row) => {
          if (row.from === 'Assistente')
            return (
              <div key={row._id} className={classes.assistantLine}>
                <Avatar className={classes.purpleAvatar}>A</Avatar>
                <Paper
                  className={clsx(
                    classes.message,
                    row.to === conversa.teacherName ? classes.teacherColor : classes.studentColor
                  )}
                >
                  {createMessage(row, classes)}
                </Paper>
              </div>
            );
          if (row.from === conversa.teacherName)
            return (
              <div key={row._id} className={classes.userLine}>
                <Avatar className={classes.greenAvatar}>{row.from?.charAt()}</Avatar>
                <Paper className={clsx(classes.message, classes.teacherColor)}>
                  {createMessage(row, classes)}
                </Paper>
              </div>
            );
          return (
            <div key={row._id} className={classes.userLine}>
              <Avatar className={classes.orangeAvatar}>{row.from?.charAt()}</Avatar>
              <Paper className={clsx(classes.message, classes.studentColor)}>
                {createMessage(row, classes)}
              </Paper>
            </div>
          );
        })}
    </Paper>
  );
}
