import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';

import api from './../../services/api';

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
  main: {
    width: '100%',
  },
  newConnectionButton: {
    marginBottom: '1%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newConnectionForm: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Intellilogs() {
  const history = useHistory();
  const classes = useStyles();
  const [boards, setBoards] = useState([]);
  const [openNewConnectionModal, setOpenNewConnectionModal] = useState(false);
  const [creatingConnection, setCreatingConnection] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [cardId, setCardId] = useState('');

  function handleNewConnectionButtonClick() {
    api
      .get('/board')
      .then((response) => {
        setBoards(response.data);
        setSelectedBoard(response?.data[0]?._id);
        setOpenNewConnectionModal(true);
      })
      .catch((error) => {
        alert('Ocorreu um erro ao buscar os boards disponíveis.');
      });
  }

  function handleCreateConnection() {
    if (cardId === '') return alert('Preencha o ID do card');
    setCreatingConnection(true);
    api
      .post('/createConnection', { boardId: selectedBoard, cardId })
      .then((response) => {
        setCreatingConnection(false);
        history.push(`/conversation/${response.data._id}`);
      })
      .catch((error) => {
        setCreatingConnection(false);
        console.log(error);
      });
  }

  const handleNewConnectionClose = () => {
    if (creatingConnection) return;
    setOpenNewConnectionModal(false);
  };

  return (
    <>
      <Button
        variant='contained'
        onClick={handleNewConnectionButtonClick}
        className={classes.newConnectionButton}
      >
        Criar nova conexão
      </Button>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={openNewConnectionModal}
        onClose={handleNewConnectionClose}
        disabled={creatingConnection}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openNewConnectionModal}>
          <div className={classes.newConnectionForm}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputLabel htmlFor='uncontrolled-native'>Board</InputLabel>
                <NativeSelect
                  inputProps={{
                    name: 'client',
                  }}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  defaultValue={selectedBoard}
                >
                  {boards.map((board) => {
                    return (
                      <option key={board._id} value={board._id}>
                        {board._id}
                      </option>
                    );
                  })}
                </NativeSelect>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='id'
                  label='ID do card'
                  variant='outlined'
                  value={cardId}
                  name='card'
                  onChange={(e) => setCardId(e.target.value)}
                  required
                  className={classes.formFields}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  disabled={creatingConnection}
                  onClick={handleCreateConnection}
                >
                  {creatingConnection ? <CircularProgress size={25} /> : 'Criar'}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
