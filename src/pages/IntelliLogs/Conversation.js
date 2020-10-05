import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import Switch from '@material-ui/core/Switch';
import * as moment from 'moment';

import api from './../../services/api'
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
    alignItems: 'center'    
  },
  logo: {
    display: 'table',
    margin: '-5px auto',
    width: '40%',
    padding: '0 10px'
  },
  main: {
    width: '100%'
  },
  infos: {
    margin: '0 2%'
  },
  rating: {
    padding: '2%',
    margin: '2%'
  }
}));

function _mapRatingToNPS(rating) {
  switch(rating) {
    case 10:
      return 'Promotor';
    case 8:
      return 'Neutro';
    case 6:
      return 'Detrator';
    default:
      return 'Não avaliado';
  }
}

export default function Conversation(props) {
  const classes = useStyles();
  const history = useHistory();
  const [conversa, setConversa] = useState({});
  const { id } = props.match.params;
  console.log(conversa);

  useEffect(() => {
    api.get(`/conversation/${id}`).then(response => {
      setConversa(response.data);
    })
  }, [id]);

  const handleChangeIgnoreRating = (e) => {
    api.post('/conversation/rate', {
      conversationId: id,
      ignoreRating: !e.target.checked
    })
    setConversa(previsousState => {
      return {
        ...previsousState,
        ignoreRating: !e.target.checked
      }
    })
  }

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
                <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <Link className="backLink" onClick={() => { history.goBack() }} >
                      <ArrowLeftIcon size={16} />
                      Voltar
                    </Link>
                  </Grid>
                  <Grid item xs={7} >
                    <div className={classes.infos}>
                      <p><b>Data:</b> {moment(conversa.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                    </div>
                  </Grid>
                  <Grid item xs={5} >
                    {(conversa.rating || conversa.observation) && <Paper className={classes.rating}>
                      <p><b>Avaliação:</b> {_mapRatingToNPS(conversa.rating)}</p>
                      <p><b>Observação:</b> {conversa.observation}</p>
                      Considerar avaliação: <Switch
                        checked={!conversa.ignoreRating}
                        onChange={handleChangeIgnoreRating}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </Paper>}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} >
              <Dialog conversa={conversa}/>
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