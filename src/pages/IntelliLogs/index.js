import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DatePicker from './../../components/Datepicker';
import Chart from '../../components/BarChart';
import Table from './../../components/Table';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';

import api from './../../services/Intelliboard';
import localStorageStateHook from './../../utils/useLocalStorageState';
import { Link } from 'react-router-dom';
import { ArrowForwardOutlined } from '@material-ui/icons';

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
    justifyContent: 'space-between',
  },
  form: {
    display: 'flex',
    padding: '0 15%',
    justifyContent: 'space-between',
  },
  sendButton: {
    marginBottom: '15px',
  },
  logo: {
    display: 'table',
    margin: '-10px auto',
    width: '40%',
    padding: '0 10px',
  },
  chart: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  main: {
    width: '100%',
  },
  table: {
    width: '100%',
    padding: '1%',
  },
  details: {
    margin: '2% 0 5% 0',
    padding: '1%',
    width: '30%',
  },
}));

export default function Intellilogs() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [startDate, setstartDate] = useLocalStorageState(
    keys.INTELLILOGS_DATA_INICIO,
    new Date(),
    useState
  );
  const [endDate, setendDate] = useLocalStorageState(
    keys.INTELLILOGS_DATA_FIM,
    new Date(),
    useState
  );
  const [atendimentos, setAtendimentos] = useState([]);
  const [page, setPage] = useLocalStorageState(
    keys.INTELLILOGS_PAGINA_ATUAL,
    0,
    useState
  );
  const [pageSize, setPageSize] = useLocalStorageState(
    keys.INTELLILOGS_TAMANHO_PAGINA,
    5,
    useState
  );
  const [isLoading, setLoading] = useState(false);
  const columns = [
    { title: 'ID', field: '_id' },
    { title: 'Data', field: 'createdAt' },
    { title: 'Setor', field: 'sector' },
    {
      title: 'Detalhes',
      field: '_id',
      // eslint-disable-next-line react/display-name
      render: (element) => (
        <Link to={`/conversation/${element._id}`}>
          {' '}
          Visualizar conversa <ArrowForwardOutlined size={16} />
        </Link>
      ),
      export: false,
    },
  ];
  const title = 'Atendimentos';
  const onRowUpdate = async (newData, oldData) => {
    if (oldData) {
      setAtendimentos((prevState) => {
        const data = prevState;
        data[data.indexOf(oldData)].viewed = newData.viewed;
        return data;
      });

      await api.put('/updateViewed', newData);
    }
  };
  useEffect(() => {
    setLoading(true);
    api
      .get('/atendimentos', {
        params: {
          startDate,
          endDate,
        },
      })
      .then((response) => {
        setLoading(false);
        setAtendimentos(response.data);
      });
  }, [startDate, endDate]);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <img className={classes.logo} src={Logo} alt={''} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.dataPickers}>
                <DatePicker
                  value={startDate}
                  handleChangeDate={setstartDate}
                  id={'data_inicio'}
                  label={'Data inicial'}
                />
                <DatePicker
                  value={endDate}
                  handleChangeDate={setendDate}
                  id={'data_fim'}
                  label={'Data final'}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.chart}>
                <Chart data={atendimentos} xIndex="Atendimentos" />
                <Paper className={classes.details}>
                  <b>Total de atendimentos no período: </b>
                  {atendimentos.length}
                </Paper>
              </Paper>
            </Grid>
            {atendimentos.length > 0 && (
              <Grid item xs={12}>
                <Paper className={classes.table}>
                  <Table
                    data={atendimentos}
                    isLoading={isLoading}
                    initialPage={page}
                    onChangePage={setPage}
                    pageSize={pageSize}
                    onChangeRowsPerPage={setPageSize}
                    columns={columns}
                    title={title}
                    onRowUpdate={onRowUpdate}
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
