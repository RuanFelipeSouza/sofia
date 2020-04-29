import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DatePicker from './../../components/Datepicker';
import Select from './../../components/Select';
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
    padding: '0 10%',
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
    width: '40%',
    padding: '0 10px'
  },
  chart: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  main: {
    width: '100%'
  },
  table: {
    width: '100%',
    padding: '1%'
  }
}));

export default function Intellilogs() {
  const classes = useStyles();
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [atendimentos, setAtendimentos] = useState([]);
  const [project, setProject] = useState('Login');
  const [isLoading, setLoading] = useState(false);

  useEffect(_ => {
    setLoading(true);
    api.get('/atendimentos', {
      params: {
        dataInicio, 
        dataFim,
        projeto: project
      }
    }).then(response => {
      setLoading(false);
      setAtendimentos(response.data);
    })
}, [dataInicio, dataFim, project]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <img className={classes.logo} src={Logo} alt={""} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Paper className={classes.dataPickers}>
                <Select handleSelectChange={setProject} />
                <DatePicker value={dataInicio} handleChangeDate={setDataInicio} id={"data_inicio"} label={"Data inicial"} />
                <DatePicker value={dataFim} handleChangeDate={setDataFim} id={"data_fim"} label={"Data final"} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <Chart atendimentos={atendimentos}/>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.table}>
                <Table atendimentos={atendimentos} setAtendimentos={setAtendimentos} isLoading={isLoading} />
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