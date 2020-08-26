import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { object } from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import * as moment from 'moment';

import api from './../../services/Intelliboard';
import MessagesBody from '../../components/MessagesBody/MessagesBody';
import { BodyContainer } from '../../components/MessagesBody/styles';

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
    alignItems: 'center',
  },
  logo: {
    display: 'table',
    margin: '-5px auto',
    width: '40%',
    padding: '0 10px',
  },
  main: {
    width: '100%',
  },
  infos: {
    margin: '0 2%',
  },
  conversation: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 5%',
  },
}));

export default function Conversation(props) {
  const classes = useStyles();
  const history = useHistory();
  const [dialog, setDialog] = useState([]);
  const [createdAt, setCreatedAt] = useState();
  const { id } = props.match.params;
  const animatedResponse = false;
  useEffect(() => {
    api.get(`/conversation/${id}`).then((response) => {
      setDialog(
        response.data.messages.map((e) =>
          e.from === 'Assistente'
            ? { ...e, outputs: [{ response_type: 'text', text: e.text }] }
            : e
        )
      );
      setCreatedAt(response.data.createdAt);
    });
  }, [id]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <img className={classes.logo} src={Logo} alt={''} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Link
                      to=""
                      className="backLink"
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <ArrowLeftIcon size={16} />
                      Voltar
                    </Link>
                  </Grid>
                  <Grid item xs={9}>
                    <div className={classes.infos}>
                      <p>
                        <b>Data:</b>
                        {moment(createdAt).format('DD/MM/YYYY HH:mm')}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={3}></Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <BodyContainer backgroundColor='none'>
                <Paper className={classes.conversation}>
                  {
                    <MessagesBody
                      loading={false}
                      ismobile={false}
                      conversationStack={dialog}
                      animatedResponse={animatedResponse}
                      backgroundColor='none'
                    ></MessagesBody>
                  }
                </Paper>
              </BodyContainer>
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

Conversation.propTypes = {
  match: object,
};
