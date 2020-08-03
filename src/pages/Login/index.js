import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Baner from './../../assets/Baner.png';
import api from '../../services/Intelliboard';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '60%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    width: '100%'
  }
}));

export default function SignInSide() {
  const history = useHistory();
  const classes = useStyles();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(false);
    setHelperText('');
  }, [user, password]);

  async function handleLogin(e) {
    setLoading(true);
    e.preventDefault();
    setError(false);
    try {
      const result = await api.post('/login', {
        email: user,
        password
      });
      await localStorage.setItem('Authorization', result.headers.authorization);
      api.defaults.headers.common = {
        Authorization: result.headers.authorization
      };

      history.push('/intellilogs');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setHelperText('Falha no login, por favor verifique as credenciais.');
      setError(true);
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={2} md={4} className={classes.banner} >
        <img className={classes.banner} src={Baner} alt={''} />
      </Grid>
      <Grid item xs={12} sm={10} md={8} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} noValidate >
            <FormControl component="fieldset" error={error} className={classes.formControl}>
              <TextField
                error={error}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user"
                label="Nome de usuário"
                name="user"
                autoComplete="user"
                autoFocus
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <TextField
                error={error}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="senha"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormHelperText>{helperText}</FormHelperText>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
                onClick={handleLogin}
                style={{ height: 46 }}
              >
                {loading ? (<CircularProgress size={25} />) : 'Entrar'}
              </Button>
            </FormControl>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}