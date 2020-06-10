import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DatePicker from '../../components/Datepicker';
import TextField from '@material-ui/core/TextField';
import Select from '../../components/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Copyright from '../../components/Copyright';
import Sidebar from '../../components/Sidebar';
import Table from './../../components/GenericTable';
import Alert from '@material-ui/lab/Alert';

import api from '../../services/api';
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
    width: '100%',
    overflow: 'auto',
  },
  filter: {
    display: 'flex',
    padding: '0 10%',
    justifyContent: 'space-evenly'
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
  },
  input: {
    width: '90%%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const columns = [
  { title: 'Arquivo', field: 'arquivo' },
  { title: 'Tema', field: 'tema' },
  {
    title: 'Responsável',
    field: 'responsavel',
    customFilterAndSearch: (term, { responsavel }) => term === '!' ? !responsavel : responsavel && responsavel.toLowerCase().includes(term.toLowerCase())
  }
];

const options = {
  selection: true
};

export default function Responsible() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [startDate, setStartDate] = useLocalStorageState(keys.INTELLILOGS_DATA_INICIO, new Date(), useState);
  const [endDate, setEndDate] = useLocalStorageState(keys.INTELLILOGS_DATA_FIM, new Date(), useState);
  const [project, setProject] = useLocalStorageState(keys.INTELLILOGS_PROJETO, 'Login', useState);
  const [isLoading, setLoading] = useState(false);
  const [nButtonPressed, setNButtonPressed] = useState(0);
  const [responsibles, setResponsibles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [responsability, setResponsability] = useState('');
  const [alertVisible, setAlertVisibility] = useState(false);

  useEffect(_ => {
    setLoading(true);
    setResponsability('');
    setSelectedRows([]);
    setAlertVisibility(false);
    api.get('/responsaveis', {
      params: {
        dataInicio: startDate,
        dataFim: endDate,
        projeto: project
      }
    }).then(response => {
      setResponsibles(response.data);
      setLoading(false);
    })
  }, [startDate, endDate, project, nButtonPressed]);

  const assignResponsability = async (e) => {
    setLoading(true);
    e.preventDefault();
    const curationList = selectedRows.map(({ _id }) => _id);

    try {
      await api.put('/responsaveis', { curationList, responsability });
      setNButtonPressed(nButtonPressed + 1);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleRowSelection = (rows) => {
    setSelectedRows(rows);
    setAlertVisibility(false);
  };

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Paper className={classes.paper}>
              <Grid container direction='column'>
                <Grid item xs className={classes.filter}>
                  <Select value={project} handleSelectChange={setProject} />
                  <DatePicker value={startDate} handleChangeDate={setStartDate} id={"data_inicio"} label={"Data inicial"} />
                  <DatePicker value={endDate} handleChangeDate={setEndDate} id={"data_fim"} label={"Data final"} />
                </Grid>
              </Grid>
            </Paper>

            {selectedRows.length > 0 &&
              <Paper className={classes.paper}>
                <Grid item xs className={classes.filter}>
                  <TextField
                    name="responsavel"
                    label="Responsável"
                    id="responsavel"
                    value={responsability}
                    onChange={(e) => { setResponsability(e.target.value); setAlertVisibility(false); }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isLoading || !responsability}
                    onClick={() => setAlertVisibility(true)}
                    style={{ height: 46 }}
                  >
                    {isLoading ? (<CircularProgress size={25} />) : 'Atribuir Responsabilidade'}
                  </Button>
                </Grid>
                {alertVisible &&
                  <Alert
                    severity="warning"
                    action={
                      <Button color="inherit" size="small" onClick={assignResponsability}>
                        Prosseguir
                    </Button>
                    }
                  >
                    Atenção, você irá atribuir <strong>{selectedRows.length} registro(s)</strong> para o(a) responsável <strong>{responsability}</strong>. Deseja prosseguir?
                </Alert>
                }
              </Paper>
            }

            <Grid item xs={12}>
              <Paper className={classes.table}>
                <Table
                  title='Responsáveis'
                  columns={columns}
                  data={responsibles}
                  options={options}
                  isLoading={isLoading}
                  onSelectionChange={handleRowSelection}
                />
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