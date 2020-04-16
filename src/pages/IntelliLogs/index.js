import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import DatePicker from './../../components/Datepicker';
import Chart from './../../components/Chart';
import Table from './../../components/Table';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';

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
  dataPickers: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
    padding: '0 15%',
    justifyContent: 'space-between'
  },
  form: {
    display: 'flex',
    padding: '0 15%',
    justifyContent: 'space-between'
  },
  sendButton: {
    marginBottom: '15px'
  },
  logo: {
    display: 'table',
    margin: '-10px auto',
    height: '5%',
    padding: '0 10px'
  },
  chart: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [atendimentos, setAtendimentos] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await api.get('/teste', {
      params: {
        dataInicio, 
        dataFim
      }
    });

    setAtendimentos(result.data);
  }

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.content}>
        <img className={classes.logo} src={Logo} alt={""} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Paper className={classes.form}>
                <form onSubmit={handleSubmit}>
                  <FormControl component="fieldset" className={classes.formControl}>
                    {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                    <FormGroup>
                      <Grid container spacing={2}>
                        <Grid item xs={12} className={classes.dataPickers}>
                          <DatePicker value={dataInicio} onChange={setDataInicio} id={"data_inicio"} label={"Data inicial"} />
                          <DatePicker value={dataFim} onChange={setDataFim} id={"data_fim"} label={"Data final"} />
                        </Grid>
                        <Grid item xs={10} >
                          {/* <Button variant="contained">Enviar</Button> */}
                        </Grid>
                        <Grid item xs={2} className={classes.sendButton}>
                          <Button type="submit" variant="contained">Enviar</Button>
                        </Grid>
                      </Grid>

                    </FormGroup>
                  </FormControl>
                </form>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <Chart />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Table atendimentos={atendimentos}/>
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