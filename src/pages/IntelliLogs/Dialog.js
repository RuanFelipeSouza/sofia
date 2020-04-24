import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple, green } from '@material-ui/core/colors';
import * as moment from 'moment';
import * as parse from 'html-react-parser';

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
    marginTop: '3%',
    backgroundColor: '#DBF6C6',
    padding: '0 3%',
    maxWidth: '60%',
    minWidth: '25%'
  },
  teacherLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  teacherMessage: {
    marginTop: '3%',
    backgroundColor: '#FFFFFA',
    padding: '0 3%',
    maxWidth: '60%',
    minWidth: '25%'
  },
  studentLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  studentMessage: {
    marginTop: '3%',
    backgroundColor: '#FFFFEF',
    padding: '0 3%',
    maxWidth: '60%',
    minWidth: '25%'
  },
  orangeAvatar: {
    margin: '0 2%',
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: '0 2%',
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  greenAvatar: {
    margin: '0 2%',
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
  },
  messageDatetime: {
    color: '#888',
    margin: '0',
    textAlign: 'right'
  }
}));

function formatMessage(msg) {
  msg = msg.replace(/(\*)([^*]*)(\*)/g, '<b>$2</b>'); //coloca negrito na mensagem, substitui *texto* por <b>texto</b>
  msg = msg.replace('\n','<br/>'); //coloca quebra de linha na mensagem
  return parse(msg);
}

export default function Dialog(props) {
  const classes = useStyles();
  const { conversa } = props;

    return (
        <Paper className={classes.conversation}>
            {conversa.history && conversa.history.map((row) => {
              if(row.from === 'Assistente') 
                  return <div key={row._id} className={classes.assistantLine}>
                  <Avatar className={classes.purpleAvatar}>A</Avatar>
                  <Paper className={classes.assistantMessage}>
                      <p><b>{row.from}</b><br/>
                      {formatMessage(row.text)}</p>
                      <h5 className={classes.messageDatetime}>{moment(row.date).format("DD/MM/YYYY HH:mm")}</h5>
                  </Paper>
                  </div>
              if(row.from === conversa.teacherName) 
                  return <div key={row._id} className={classes.teacherLine}>
                  <Avatar className={classes.greenAvatar}>{row.from.charAt()}</Avatar>
                  <Paper className={classes.teacherMessage}>
                      <p><b>{row.from}</b><br/>
                      {formatMessage(row.text)}</p>
                      <h5 className={classes.messageDatetime}>{moment(row.date).format("DD/MM/YYYY HH:mm")}</h5>
                  </Paper>
                  </div>
              return <div key={row._id} className={classes.studentLine}>
                  <Avatar className={classes.orangeAvatar}>{row.from.charAt()}</Avatar>
                  <Paper className={classes.studentMessage}>
                  <p><b>{row.from}</b><br/>
                  {formatMessage(row.text)}</p>
                  <h5 className={classes.messageDatetime}>{moment(row.date).format("DD/MM/YYYY HH:mm")}</h5>
                  </Paper>
              </div>
            })} 
        </Paper>
    )
}