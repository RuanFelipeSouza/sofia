import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../../components/Copyright';
import Sidebar from '../../components/Sidebar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

import api from '../../services/Intelliboard';

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
    padding: '0 15%',
    justifyContent: 'space-between',
  },
  main: {
    width: '100%',
  },
  formFields: {
    width: '100%'
  }
}));

export default function Settings() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertText, setAlertText] = useState('');
  const [configs, setConfigs] = useState({});

  useEffect(() => {
    setLoading(true);
    api
      .get('/settings')
      .then((response) => {
        setConfigs(response.data);
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setConfigs(oldState => {
      return {
        ...oldState,
        [name]: value.trim()
      };
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', configs);
      setAlertType('success');
      setAlertText('Alteração realizada');
    }catch(e) {
      console.log(e);
      setAlertType('error');
      setAlertText('Erro ao realizar alteração');
    }
    setSaving(false);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      setAlertType('');
      setAlertText('');
    }, 3000);
  };

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper} >
                <form onSubmit={handleSubmit} component="fieldset" className={classes.formControl}>
                  <Grid container spacing={2}>
                    {!loading && <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="botName" label="Nome do Assistente" variant="outlined" value={configs.botName} name="botName" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="watsonConversationWorkspace" label="Watson Workspace" variant="outlined" value={configs.watsonConversationWorkspace}  name="watsonConversationWorkspace" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="watsonConversationUsername" label="Watson Username" variant="outlined" value={configs.watsonConversationUsername}  name="watsonConversationUsername" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="watsonConversationPassword" label="Watson Password" variant="outlined" value={configs.watsonConversationPassword}  name="watsonConversationPassword" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="watsonConversationURL" label="Watson URL" variant="outlined" value={configs.watsonConversationURL}  name="watsonConversationURL" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="twilioNumber" label="Número do Twilio" variant="outlined" value={configs.twilioNumber}  name="twilioNumber" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="twilioAccountSID" label="Twilio SID" variant="outlined" value={configs.twilioAccountSID}  name="twilioAccountSID" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                        <Grid item xs={12} className={classes.form} >
                          <TextField id="twilioAuthToken" label="Twilio Auth Token" variant="outlined" value={configs.twilioAuthToken}  name="twilioAuthToken" onChange={handleChange} className={classes.formFields} />
                        </Grid>
                      </Grid>
                    </Grid>}
                    <Grid item xs={1}>
                      <Button variant="contained" type="submit">{saving ? (<CircularProgress size={25} />) : 'Salvar'}</Button>
                    </Grid>
                    <Grid item xs={11}>
                      {showAlert && <Alert severity={alertType}>{alertText}</Alert>}
                    </Grid>
                  </Grid>
                </form>
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
