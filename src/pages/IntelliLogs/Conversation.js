import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Logo from './../../assets/logointellilogs.png';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import DialogModal from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as moment from 'moment';

import api from './../../services/api';
import Dialog from './Dialog';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  form: {
    display: 'flex',
  },
  backLink: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    display: 'table',
    margin: '-5px auto',
    width: '40%',
    padding: '0 10px',
  },
  main: {
    width: '100%',
  },
  infos: {
    margin: '0 2%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editForm: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  editButton: {
    margin: '1% 2%',
  },
}));

export default function Conversation(props) {
  const classes = useStyles();
  const history = useHistory();
  const [conversa, setConversa] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const { id } = props.match.params;
  console.log(conversa);

  useEffect(() => {
    api.get(`/conversation/${id}`).then((response) => {
      setConversa(response.data);
    });
  }, [id]);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleUpdateConnection = () => {
    setLoadingUpdate(true);
    api
      .put('/updateConnection', {
        id,
        data: selectedDate,
      })
      .then((response) => {
        setConversa(response.data);
        setLoadingUpdate(false);
        setOpenModal(false);
      });
  };

  const handleDelete = async e => {
    setOpenDeleteDialog(false);
    api
      .put('/updateConnection', {
        id
      })
      .then((response) => {
        setConversa(response.data);
        setLoadingUpdate(false);
        setOpenModal(false);
      });
  }

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <img className={classes.logo} src={Logo} alt={''} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Link
                      className='backLink'
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <ArrowLeftIcon size={16} />
                      Voltar
                    </Link>
                  </Grid>
                  <Grid item xs={9}>
                    <div className={classes.infos}>
                      <p>
                        <b>Aluno:</b> {conversa?.studentName}
                      </p>
                      <p>
                        <b>Professor:</b> {conversa?.teacherName}
                      </p>
                      <p>
                        <b>Status:</b> {conversa['class']?.status}
                      </p>
                      <p>
                        <b>Id do board:</b> {conversa?.board?._id}
                      </p>
                      <p>
                        <b>Nome do board:</b> {conversa?.board?.name}
                      </p>
                      <p>
                        <b>Data marcada:</b>{' '}
                        {conversa['class']?.date &&
                          moment(conversa['class']?.date).format(
                            'DD/MM/YYYY HH:mm'
                          )}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant='contained'
                        onClick={handleOpen}
                        className={classes.editButton}
                      >
                        Editar
                      </Button>
                      <Modal
                        aria-labelledby='transition-modal-title'
                        aria-describedby='transition-modal-description'
                        className={classes.modal}
                        open={openModal}
                        onClose={handleClose}
                        disabled={loadingUpdate}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={openModal}>
                          <div className={classes.editForm}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDateTimePicker
                                variant='inline'
                                ampm={false}
                                label='Data'
                                value={selectedDate}
                                onChange={handleDateChange}
                                onError={console.log}
                                disablePast
                                format='dd/MM/yyyy HH:mm'
                              />
                            </MuiPickersUtilsProvider>
                            <br />
                            <br />
                            <Button
                              variant='contained'
                              onClick={handleUpdateConnection}
                            >
                              {loadingUpdate ? (
                                <CircularProgress size={25} />
                              ) : (
                                'Salvar'
                              )}
                            </Button>
                          </div>
                        </Fade>
                      </Modal>
                      {conversa.class && conversa['class'].status !== 'cancelada' && <Button variant="contained" color="secondary" onClick={() => setOpenDeleteDialog(true)} >
                          Encerrar
                        </Button>
                      }
                      <DialogModal
                        open={openDeleteDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setOpenDeleteDialog(false)}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle id="alert-dialog-slide-title">{"Você confirma o encerramento?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-slide-description">
                            Essa ação não pode ser desfeita.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                            Cancelar
                          </Button>
                          <Button onClick={handleDelete} color="primary">
                            Confirmar
                          </Button>
                        </DialogActions>
                      </DialogModal>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    {conversa['class']?.studentSurveyId && (
                      <Link
                        className='backLink'
                        to={`/survey/${conversa['class']?.studentSurveyId}`}
                      >
                        Visualizar pesquisa do Aluno
                      </Link>
                    )}
                    <br />
                    {conversa['class']?.teacherSurveyId && (
                      <Link
                        className='backLink'
                        to={`/survey/${conversa['class']?.teacherSurveyId}`}
                      >
                        Visualizar pesquisa do Professor
                      </Link>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Dialog conversa={conversa} />
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
