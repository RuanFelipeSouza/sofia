import React, { useEffect, Fragment, useState } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Table from './../../components/GenericTable';
import LineChart from './../../components/LineChart';
import PieChart from './../../components/PieChart';
import GenericBarChart from '../../components/GenericBarChart';
import Copyright from './../../components/Copyright';
import api from './../../services/api';
import localStorageStateHook from './../../utils/useLocalStorageState';

const useStyles = makeStyles((theme) => ({
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
    padding: '0 5%',
    alignItems: 'center'
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

const rightWrongColors = ['#8884d8', '#BAB8D7']

const columns = [
  { title: 'Intenção', field: 'intent' },
  { title: 'Descrição', field: 'description' }
];

const Desempenho = (props) => {
  const { misunderstoodMessages, atendimentos } = props;
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [dataInicio, setDataInicio] = useLocalStorageState(keys.INTELLILOGS_DATA_INICIO, new Date(), useState);
  const [dataFim, setDataFim] = useLocalStorageState(keys.INTELLILOGS_DATA_FIM, new Date(), useState);
  const [project, setProject] = useLocalStorageState(keys.INTELLILOGS_PROJETO, 'Login', useState);
  const [contentPendencies, setContentPendencies] = useState({ pendencies: [], total: [] });
  const [intelliwayPendencies, setIntelliwayPendencies] = useState({ pendencies: [], total: [] });
  const [botPendencies, setBotPendencies] = useState({ pendencies: [], total: [] });
  const [intents, setIntents] = useState([]);
  const [unusedIntents, setUnusedIntents] = useState([]);

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

  useEffect(() => {
    api.get('/intencoesNaoUtilizadas', {
      params: {
        projeto: project
      }
    }).then(response => {
      setUnusedIntents(response.data);
    })
  }, [project]);

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <b>Total de atendimentos no período: </b>
          {atendimentos.length}
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chart}>
            <PieChart data={misunderstoodMessages} />
            <LineChart atendimentos={atendimentos} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <b>Validação de Curadoria por Responsável (Conteúdo) </b>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chart}>
            <PieChart data={contentPendencies.total} />
            <GenericBarChart
              data={contentPendencies.pendencies}
              isStacked
              interval={0}
              colors={rightWrongColors}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <b>
            Validação de Curadoria por Responsável (Possível Validar no Bot){' '}
          </b>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chart}>
            <PieChart data={intelliwayPendencies.total} />
            <GenericBarChart
              data={intelliwayPendencies.pendencies}
              isStacked
              interval={0}
              colors={rightWrongColors}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <b>Validação de Curadoria por Responsável (Bot) </b>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chart}>
            <PieChart data={botPendencies.total} />
            <GenericBarChart
              data={botPendencies.pendencies}
              isStacked
              interval={0}
              colors={rightWrongColors}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <b>Intenções Utilizadas</b>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chart}>
            <GenericBarChart
              data={intents}
              width={1000}
              colors={rightWrongColors}
            />
          </Paper>
        </Grid>
        {unusedIntents.length && (
          <Fragment>
            <Grid item xs={6}>
              <b>Intenções Nunca Utilizadas</b>
            </Grid>
            <Grid item xs={12}>
              <Table title='Intenções' columns={columns} data={unusedIntents} />
            </Grid>
          </Fragment>
        )}
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Desempenho;
