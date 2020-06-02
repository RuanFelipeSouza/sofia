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
import PieChart from './../../components/PieChart';
import StackedBarChart from './../../components/StackedBarChart';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';

import api from './../../services/api';
import localStorageStateHook from './../../utils/useLocalStorageState';

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
    justifyContent: 'space-between',
    padding: '0 5%'
  },
  main: {
    width: '100%'
  },
  table: {
    width: '100%',
    padding: '1%'
  },
  details: {
    margin: '2% 0 5% 0',
    padding: '1%',
    width: '30%'
  }
}));

export default function Intellilogs() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [dataInicio, setDataInicio] = useLocalStorageState(keys.INTELLILOGS_DATA_INICIO, new Date(), useState);
  const [dataFim, setDataFim] = useLocalStorageState(keys.INTELLILOGS_DATA_FIM, new Date(), useState);
  const [atendimentos, setAtendimentos] = useState([]);
  const [misunderstoodMessages, setMisunderstoodMessages] = useState([]);
  const [pendencies, setPendencies] = useState([]);
  const [project, setProject] = useLocalStorageState(keys.INTELLILOGS_PROJETO, 'Login', useState);

  useEffect(_ => {
    api.get('/atendimentos', {
      params: {
        dataInicio,
        dataFim,
        projeto: project
      }
    }).then(response => {
      const { data: atendimentos } = response;
      setAtendimentos(atendimentos);

      const amountMisunderstoodMessages = atendimentos.filter(({ misunderstoodMessages }) => misunderstoodMessages.length > 0).length;
      const misunderstoodMessages = [
        { name: 'Entendido', value: atendimentos.length - amountMisunderstoodMessages, fill: '#8884d8' },
        { name: 'Não Entendido', value: amountMisunderstoodMessages, fill: '#BAB8D7' }
      ]
      setMisunderstoodMessages(misunderstoodMessages);
    })
  }, [dataInicio, dataFim, project]);

  useEffect(() => {
    api.get('/pendenciaPorResponsavel', {
      params: {
        dataInicio,
        dataFim,
        projeto: project
      }
    }).then(response => {
      setPendencies(response.data);
    })
  }, [dataInicio, dataFim, project]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Paper className={classes.dataPickers}>
                <Select value={project} handleSelectChange={setProject} />
                <DatePicker value={dataInicio} handleChangeDate={setDataInicio} id={"data_inicio"} label={"Data inicial"} />
                <DatePicker value={dataFim} handleChangeDate={setDataFim} id={"data_fim"} label={"Data final"} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <b>Total de atendimentos no período: </b>{atendimentos.length}
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <Chart atendimentos={atendimentos} />
                <PieChart data={misunderstoodMessages} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <b>Validação de Curadoria por Responsável </b>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <StackedBarChart data={pendencies} />
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