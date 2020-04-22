import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple, green } from '@material-ui/core/colors';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import * as moment from 'moment';
import * as parse from 'html-react-parser';

import api from './../../services/api'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'row',
  },
  form: {
    display: 'flex',
  },
  backLink: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'    
  },
  logo: {
    display: 'table',
    margin: '-5px auto',
    width: '40%',
    padding: '0 10px'
  },
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 5%'
  },
  main: {
    width: '100%'
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
  infos: {
    margin: '0 2%'
  }
}));

function formatMessage(msg) {
  msg = msg.replace(/(\*)([^*]*)(\*)/g, '<b>$2</b>'); //coloca negrito na mensagem, substitui * por <b>
  msg = msg.replace('\n','<br/>'); //coloca quebra de linha na mensagem
  return parse(msg);
}

export default function Conversation(props) {
  const classes = useStyles();
  const history = useHistory();
  const [conversa, setConversa] = useState({});

  useEffect(() => {
    const { id } = props.match.params;
    api.get(`/conversation/${id}`,{
      headers: {
        Authorization: sessionStorage.getItem('Authorization')
      }
    }).then(response => {
        setConversa(response.data);
    })
  }, [props.match.params]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <img className={classes.logo} src={Logo} alt={""} />
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <Paper className={classes.form}>
                      {/* <Button onClick={() => { history.goBack()  }} variant="contained">Enviar</Button> */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} >
                          <Link className="backLink" onClick={() => { history.goBack() }} >
                            <ArrowLeftIcon size={16} />
                            Voltar
                          </Link>
                        </Grid>
                        <Grid item xs={12} >
                          <div className={classes.infos}>
                            <p><b>Aluno:</b> {conversa.studentName}</p>
                            <p><b>Professor:</b> {conversa.teacherName}</p>
                            <p><b>Data:</b> {moment(conversa.createdAt).format("DD/MM/YYYY")}</p>
                          </div>
                        </Grid>
                      </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.conversation}>
                      {conversa.history && conversa.history.map((row) => {
                        if(row.from === conversa.teacherName) 
                          return <div key={row._id} className={classes.teacherLine}>
                            <Avatar className={classes.greenAvatar}>{row.from.charAt()}</Avatar>
                            <Paper className={classes.teacherMessage}>
                              <p><b>{row.from}</b><br/>
                              {formatMessage(row.text)}</p>
                            </Paper>
                          </div>
                        if(row.from === conversa.studentName) 
                          return <div key={row._id} className={classes.studentLine}>
                            <Avatar className={classes.orangeAvatar}>{row.from.charAt()}</Avatar>
                            <Paper className={classes.studentMessage}>
                              <p><b>{row.from}</b><br/>
                              {formatMessage(row.text)}</p>
                            </Paper>
                          </div>
                        return <div key={row._id} className={classes.assistantLine}>
                          <Avatar className={classes.purpleAvatar}>A</Avatar>
                          <Paper className={classes.assistantMessage}>
                            <p><b>{row.from}</b><br/>
                            {formatMessage(row.text)}</p>
                          </Paper>
                        </div>
                      })} 
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
        </Container>
      </main>
    </div>
  );
}