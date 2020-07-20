import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import PieChart from './../../components/PieChart';
import Copyright from './../../components/Copyright';

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
    justifyContent: 'center',
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

const Nodes = (props) => {
  const { nodeCount } = props;
  const classes = useStyles();

  const pieChartData = React.useMemo(() => [
    { name: 'Cliente', value: nodeCount.cliente, fill: '#5d58ad' },
    { name: 'Fornecedor', value: nodeCount.fornecedor, fill: '#827cf7' },
    { name: 'Login', value: nodeCount.login, fill: '#8884d8' },
    { name: 'Restante', value: 2000 - nodeCount.total, fill: '#d5d2f7' },
  ], [nodeCount]);

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <b>Quantidade de nós: </b>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chart}>
            <PieChart data={pieChartData} />
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Nodes;