import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Logo from './../../assets/logointellilogs.png';
import Copyright from '../../components/Copyright';
import Sidebar from '../../components/Sidebar';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

import api from '../../services/api';
import Dialog from './Dialog';

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
}));

export default function Survey(props) {
  const classes = useStyles();
  const history = useHistory();
  const [conversa, setConversa] = useState({});
  const { id } = props.match.params;

  useEffect(() => {
    api.get(`/survey/${id}`).then((response) => {
      setConversa(response.data);
    });
  }, [id]);

  console.log(conversa);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <img className={classes.logo} src={Logo} alt={''} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Link
                      className='backLink'
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <ArrowLeftIcon size={16} />
                      Voltar
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.infos}>
                      <p>
                        <b>Nome:</b> {conversa.name}
                      </p>
                      <p>
                        <b>Nota:</b> {conversa.nota}
                      </p>
                      <p>
                        <b>Sugestão:</b>{' '}
                        {conversa.context && conversa.context.sugestao}
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Dialog conversa={conversa} />
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
