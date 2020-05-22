import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Copyright from './../../components/Copyright';
import Sidebar from './../../components/Sidebar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  main: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <iframe 
          src="" 
          frameBorder="0" 
          allowFullScreen="true" 
          width="100%"
          height="100%"
          title={'Dashboard'}
        />
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}