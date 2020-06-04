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
import Button from '@material-ui/core/Button';
import Logo from './../../assets/logointellilogs.png';
import Copyright from '../../components/Copyright';
import Sidebar from '../../components/Sidebar';
import Table from './Table';

import api from '../../services/api';
import localStorageStateHook from '../../utils/useLocalStorageState';

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

export default function Responsible() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [dataInicio, setDataInicio] = useLocalStorageState(keys.INTELLILOGS_DATA_INICIO, new Date(), useState);
  const [dataFim, setDataFim] = useLocalStorageState(keys.INTELLILOGS_DATA_FIM, new Date(), useState);
  const [project, setProject] = useLocalStorageState(keys.INTELLILOGS_PROJETO, 'Login', useState);
  const [page, setPage] = useLocalStorageState(keys.INTELLILOGS_PAGINA_ATUAL, 0, useState);
  const [pageSize, setPageSize] = useLocalStorageState(keys.INTELLILOGS_TAMANHO_PAGINA, 5, useState);
  const [isLoading, setLoading] = useState(false);
  const [arquivo, setArquivo] = useState('');
  const [tema, setTema] = useState('');
  const [responsaveis, setResponsaveis] = useState([]);
  const [responsavel, setResponsavel] = useState('');

  useEffect(_ => {
    setLoading(true);
    api.get('/responsaveis', {
      params: {
        dataInicio,
        dataFim,
        projeto: project
      }
    }).then(response => {
      setLoading(false);
      setResponsaveis(response.data);
    })
  }, [dataInicio, dataFim, project]);

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
                  <DatePicker value={dataInicio} handleChangeDate={setDataInicio} id={"data_inicio"} label={"Data inicial"} />
                  <DatePicker value={dataFim} handleChangeDate={setDataFim} id={"data_fim"} label={"Data final"} />
                </Grid>
                {/* <Grid item xs className={classes.filter} spacing={3}>
                  <TextField
                    name="arquivo"
                    label="Arquivo"
                    id="arquivo"
                    value={arquivo}
                    onChange={(e) => setArquivo(e.target.value)}
                  />
                  <TextField
                    name="tema"
                    label="Tema"
                    id="tema"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                  />
                  <TextField
                    name="responsavel"
                    label="Responsável"
                    id="responsavel"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                  />
                </Grid> */}
              </Grid>
            </Paper>

            {responsaveis.length > 0 &&
              <Paper className={classes.paper}>
                <Grid item xs className={classes.filter}>
                  <TextField
                    name="responsavel"
                    label="Responsável"
                    id="responsavel"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    // disabled={loading}
                    // onClick={handleLogin}
                    style={{ height: 46 }}
                  >
                    Atribuir Responsabilidade
                </Button>
                </Grid>
              </Paper>
            }

            {/* <Grid item xs={12}>
              <Paper className={classes.table}>
                <Table
                  atendimentos={atendimentos}
                  setAtendimentos={setAtendimentos}
                  isLoading={isLoading}
                  initialPage={page}
                  onChangePage={setPage}
                  pageSize={pageSize}
                  onChangeRowsPerPage={setPageSize}
                />
              </Paper>
            </Grid> */}
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}