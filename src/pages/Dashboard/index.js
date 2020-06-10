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
import GenericBarChart from '../../components/GenericBarChart';
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

const rightWrongColors = ['#004000', '#660000']

export default function Intellilogs() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [dataInicio, setDataInicio] = useLocalStorageState(keys.INTELLILOGS_DATA_INICIO, new Date(), useState);
  const [dataFim, setDataFim] = useLocalStorageState(keys.INTELLILOGS_DATA_FIM, new Date(), useState);
  const [project, setProject] = useLocalStorageState(keys.INTELLILOGS_PROJETO, 'Login', useState);
  const [atendimentos, setAtendimentos] = useState([]);
  const [misunderstoodMessages, setMisunderstoodMessages] = useState([]);
  const [contentPendencies, setContentPendencies] = useState({ pendencies: [], total: [] });
  const [intelliwayPendencies, setIntelliwayPendencies] = useState({ pendencies: [], total: [] });
  const [botPendencies, setBotPendencies] = useState({ pendencies: [], total: [] });
  const [intents, setIntents] = useState([]);

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
    const fetchPendencies = (tipoValidacao, setState) => {
      api.get('/pendenciaPorResponsavel', {
        params: {
          dataInicio,
          dataFim,
          projeto: project,
          tipoValidacao
        }
      }).then(({ data }) => {
        const totalDependencies = [
          { name: 'Validado', value: 0, fill: rightWrongColors[0] },
          { name: 'Não Validado', value: 0, fill: rightWrongColors[1] }
        ];
        data.forEach((element) => {
          totalDependencies[0].value = totalDependencies[0].value + element['Validado'];
          totalDependencies[1].value = totalDependencies[1].value + element['Não Validado'];
        });
        setState({ pendencies: data, total: totalDependencies });
      })
    };

    fetchPendencies('validacaoConteudo', setContentPendencies);
    fetchPendencies('possivelValidarBOT', setIntelliwayPendencies);
    fetchPendencies('validacaoBOT', setBotPendencies);
  }, [dataInicio, dataFim, project]);

  useEffect(() => {
    api.get('/utilizazaoIntencao', {
      params: {
        dataInicio,
        dataFim,
        projeto: project
      }
    }).then(response => {
      setIntents(response.data);
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
              <b>Validação de Curadoria por Responsável (Conteúdo) </b>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <GenericBarChart data={contentPendencies.pendencies} isStacked interval={0} colors={rightWrongColors} />
                <PieChart data={contentPendencies.total} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <b>Validação de Curadoria por Responsável (Possível Validar no Bot) </b>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <GenericBarChart data={intelliwayPendencies.pendencies} isStacked interval={0} colors={rightWrongColors} />
                <PieChart data={intelliwayPendencies.total} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <b>Validação de Curadoria por Responsável (Bot) </b>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <GenericBarChart data={botPendencies.pendencies} isStacked interval={0} colors={rightWrongColors} />
                <PieChart data={botPendencies.total} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <b>Intenções Perguntadas</b>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <GenericBarChart data={intents} width={1000} />
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