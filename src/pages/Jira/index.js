import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from './Table';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { ComposedChart, Line, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, ResponsiveContainer } from 'recharts';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as moment from 'moment';

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
    padding: '2% 10%',
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
    margin: '2% 0 7% 0',
    padding: '1%',
    width: '30%'
  },
  selects: {
    width: '30%'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  updateButton: {
    width: '100%',
    marginTop: '5px'
  }
}));

function ClientSelect(props) {
  function handleChange(e) {
    api.get('/getClient', {
      params: {
        id: e.target.value
      }
    }).then(response => {
      props.setCliente(response.data);
    })
  }
  return (
    <FormControl className={props.classes.selects}>
      <InputLabel htmlFor="uncontrolled-native">Cliente</InputLabel>
      <NativeSelect
        inputProps={{
          name: 'client',
        }}
        onChange={handleChange}
        defaultValue={props.clientes[0]?._id}
      >
        {props.clientes.map((client) => {
          return <option key={client._id} value={client._id}>{client.name}</option>
        })}
      </NativeSelect>
    </FormControl>
  );
}

function DataReferenciaSelect(props) {
  function handleChange(e) {
    props.setDataReferencia(e.target.value);
  }

  return (
    <FormControl className={props.classes.selects}>
      <InputLabel htmlFor="uncontrolled-native">Mês de referência</InputLabel>
      <NativeSelect
        inputProps={{
          name: 'client',
        }}
        onChange={handleChange}
        value={props.dataReferencia}
      >
        {Object.keys(props.cliente?.limits).sort().reverse().map((date) => {
          return <option key={date} value={date}>{date}</option>
        })}
      </NativeSelect>
    </FormControl>
  );
}

function MainChart(props) {
  const data = [];
  Object.keys(props.horas).filter(e=>e!=='outros').sort().forEach(key => {
    data.push({
      mes: key, 
      limite: props.horas[key].pack,
      utilizado: props.horas[key].used,
    });
  });
  
  return (
    <div style={{ width: '90%', height: 400 }}>
      <ResponsiveContainer >
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="utilizado" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="limite" stroke="#aa53d6" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function SecondaryChart(props) {
  const data = [{ name: 'Horas consumidas', value: props.horas.used }, { name: 'Horas disponíveis', value: (props.horas.pack || props.horas.used) - props.horas.used }];
  const COLORS = ['#FF8042', '#00C49F'];
  return (
      <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }} >
        <Pie
          dataKey="value"
          data={data}
          innerRadius={40}
          outerRadius={80}
          startAngle={180}
          endAngle={0}
          fill="#82ca9d"
          label
        >
          {
            data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Legend verticalAlign="bottom" height={36}/>
        <Tooltip />
      </PieChart>
  )
}

export default function Jira() {
  const { keys, useLocalStorageState } = localStorageStateHook;
  const classes = useStyles();
  const [dataReferencia, setDataReferencia] = useLocalStorageState(keys.JIRA_DATA_REFERENCIA, '', useState);
  const [listaClientes, setListaClientes] = useLocalStorageState(keys.JIRA_CLIENTES, [], useState);
  const [cliente, setCliente] = useLocalStorageState(keys.JIRA_CLIENTE, null, useState);
  const [openModal, setOpenModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [pacoteHoras, setPacoteHoras] = useState(0);
  const [clientEmail, setClientEmail] = useState(null);

  const handleUpdate = () => {
    setLoadingUpdate(true);
    api.post('/updateClients').then(response => {
      setListaClientes(response.data);
      setDataReferencia(Object.keys(response.data[0].limits)[0]);
      setLoadingUpdate(false);

      api.get('/getClient', {
        params: {
          id: cliente._id
        }
      }).then(response => {
        setCliente(response.data);
      })
    }).catch(error => {
      setLoadingUpdate(false);
      alert('Erro ao atualizar', error);
    });
  };

  const handleEditEmail = async () => {
    setEmailLoading(true);
    try {
      await api.put(`/clients/${cliente._id}/email`, {
        email: clientEmail
      });

      setEmailModal(false);
    } catch (e) {
      alert('Erro ao atualizar email');
    }

    setEmailLoading(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect(_ => {
    api.get('/getClients').then(response => {
      setListaClientes(response.data);
      setDataReferencia(Object.keys(response.data[0].limits)[0]);

      api.get('/getClient', {
        params: {
          id: response.data[0]._id
        }
      }).then(cliente => {
        setCliente(cliente.data);
      })
    })
  }, []);

  useEffect(_ => {
    setPacoteHoras(cliente?.limits[dataReferencia]?.pack || 0);
    setClientEmail(cliente?.email);
  }, [dataReferencia, cliente]);

  useEffect(_ => {
    const mes = Object.keys(cliente?.limits || {})[0];
    setDataReferencia(mes);
  }, [cliente]);

  async function handleUpdatePacoteHoras() {
    const result = await api.post('/updatePacoteHoras', {
      cliente,
      dataReferencia,
      pacoteHoras
    });
    setCliente(result.data);
    console.log(result);
    handleClose();
  }

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        {/* <img className={classes.logo} src={Logo} alt={""} /> */}
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Paper className={classes.dataPickers}>
                {listaClientes.length && <ClientSelect classes={classes} clientes={listaClientes} setCliente={setCliente} />}
                {cliente?.name && <DataReferenciaSelect classes={classes} cliente={cliente} dataReferencia={dataReferencia} setDataReferencia={setDataReferencia} />}
                {listaClientes.length &&
                  <div>
                    <b>Última Atualização: </b>{moment(cliente?.issues[0].updatedAt).format("DD/MM/YY H:mm:ss")}<br />
                    <Button variant="contained" disabled={loadingUpdate} className={classes.updateButton} onClick={handleUpdate}>
                      {loadingUpdate ? (<CircularProgress size={25} />) : 'Atualizar agora'}
                    </Button>
                  </div>
                }
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {cliente?.limits[dataReferencia] && <Paper className={classes.chart}>
                <MainChart cliente={cliente} horas={cliente?.limits} classes={classes} />
                <Paper className={classes.details} >
                  <div>
                    <SecondaryChart cliente={cliente} horas={cliente?.limits[dataReferencia]} classes={classes} />
                    <b>Consumo de horas no período: </b>{ cliente?.limits[dataReferencia]?.used }<br />
                    <b>Pacote de horas: </b>{ cliente?.limits[dataReferencia]?.pack }
                    <Button variant="contained" onClick={handleOpen}>
                      Editar pacote de horas
                    </Button>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      className={classes.modal}
                      open={openModal}
                      onClose={handleClose}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={openModal}>
                        <div className={classes.paper}>
                          <TextField
                            id="outlined-number"
                            label="Pacote de horas"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            value={pacoteHoras}
                            onChange={e => setPacoteHoras(e.target.value)}
                          /><br /><br />
                          <Button variant="contained" onClick={handleUpdatePacoteHoras}>
                            Salvar
                        </Button>
                        </div>
                      </Fade>
                    </Modal>
                    <hr />
                    {clientEmail ? (<><b>Email: </b> <span>{clientEmail}</span></>) : <b>O client ainda não possui um email cadastrado</b>}<br /><br />
                    <Button variant="contained" onClick={() => setEmailModal(true)}>
                      Editar Email
                    </Button>
                    <Modal
                      className={classes.modal}
                      open={emailModal}
                      onClose={() => setEmailModal(false)}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={emailModal}>
                        <div className={classes.paper}>
                          <TextField
                            id="outlined-number"
                            label="E-mail"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            value={clientEmail}
                            onChange={e => setClientEmail(e.target.value)}
                          /><br /><br />
                          <Button variant="contained" onClick={handleEditEmail} disabled={emailLoading}>
                            {emailLoading ? (<CircularProgress size={25} />) : 'Salvar'}
                        </Button>
                        </div>
                      </Fade>
                    </Modal>
                  </div>
                </Paper>
              </Paper>}
            </Grid>
            {
              <Grid item xs={12}>
                <Paper className={classes.table}>
                  <Table issues={cliente?.issues.filter(issue => (issue.fields?.dataReferencia?.toString().substring(0, 7) === dataReferencia) || (!issue.fields?.dataReferencia && dataReferencia === 'outros'))} />
                </Paper>
              </Grid>
            }
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}