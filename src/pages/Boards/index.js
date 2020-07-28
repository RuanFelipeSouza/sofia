import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';
import Editor from './Editor';

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
    width: '100%'
  },
  boards: {
    margin: '5% 0'
  },
  boardInfo: {
    margin: '3%',
    cursor: 'pointer',
    padding: '3%'
  }
}));

export default function Boards() {
  const classes = useStyles();
  const [boards, setBoards] = useState([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [novo, setNovo] = useState(false);
  const [editorState, setEditorState] = useState({});
  useEffect(_ => {
    api.get('/board').then(response => {
      setBoards(response.data);
    })
  }, []);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <Editor editorState={editorState} setEditorState={setEditorState} open={openEditor} setOpen={setOpenEditor} setBoards={setBoards} novo={novo} setNovo={setNovo} />
      <main className={classes.main}>
        <Container maxWidth="lg" className={classes.container}>
          <Button 
            variant="contained" 
            onClick={() => {
              setNovo(true); 
              setEditorState({}); 
              setOpenEditor(true)
            }} 
          >
            Novo
          </Button>
          <Grid container spacing={2} className={classes.boards} >
              { 
                boards.map(board => (
                  <Grid key={board._id} item xs={4} >
                    <Paper 
                      className={classes.boardInfo} 
                      onClick={() => {
                        setEditorState(board);
                        setOpenEditor(true);
                      }} 
                    >
                      {board._id}
                    </Paper>
                  </Grid>
                ))
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