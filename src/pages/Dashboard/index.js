import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Sidebar from './../../components/Sidebar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FavoriteBorder, BarChart } from '@material-ui/icons';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import SwipeableViews from 'react-swipeable-views';
import localStorageStateHook from './../../utils/useLocalStorageState';
import api from './../../services/api';
import Desempenho from './desempenho';
import NPS from './nps';
import DatePicker from './../../components/Datepicker';
import Select from './../../components/Select';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Nodes from './nodes';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    overflow: 'hidden'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  dataPickers: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
    padding: '0 10%',
    justifyContent: 'space-between'
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Intellilogs() {
  const classes = useStyles();
  const { keys, useLocalStorageState } = localStorageStateHook;
  const [tabIndex, setTabValue] = useState(0);
  const [atendimentos, setAtendimentos] = useState([]);
  const [misunderstoodMessages, setMisunderstoodMessages] = useState([]);
  const [dataInicio, setDataInicio] = useLocalStorageState(keys.INTELLILOGS_DATA_INICIO, new Date(), useState);
  const [dataFim, setDataFim] = useLocalStorageState(keys.INTELLILOGS_DATA_FIM, new Date(), useState);
  const [project, setProject] = useLocalStorageState(keys.INTELLILOGS_PROJETO, 'Login', useState);
  const [nodeCount, setNodeCount] = useState({});

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  useEffect(_ => {

    api.get('/atendimentos', {
      params: {
        dataInicio,
        dataFim,
        projeto: project
      }
    }).then(response => {
      const { data: atendimentos } = response;
      setAtendimentos(atendimentos);

      const amountMisunderstoodMessages = atendimentos.filter(({ misunderstoodMessages }) => misunderstoodMessages.length > 0).length;
      const misunderstoodMessages = [
        { name: 'Entendido', value: atendimentos.length - amountMisunderstoodMessages, fill: '#8884d8' },
        { name: 'Não Entendido', value: amountMisunderstoodMessages, fill: '#BAB8D7' }
      ]
      setMisunderstoodMessages(misunderstoodMessages);
    })
  }, [dataInicio, dataFim, project]);

  useEffect(() => {
    api.get('/nodes').then(response => {
      setNodeCount(response.data);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <main className={classes.main}>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            // aria-label="full width tabs example"
          >
            <Tab label="Central de desempenho" icon={<BarChart />} {...a11yProps(3)} />
            <Tab label="Central NPS" icon={<FavoriteBorder />} {...a11yProps(1)} />
            <Tab label="Nós Watson" icon={<AccountTreeRoundedIcon />} {...a11yProps(0)} />
          </Tabs>
        </AppBar>
        <Container maxWidth='lg' className={classes.container}>
          <Grid item xs={12}>
            <Paper className={classes.dataPickers}>
              <Select value={project} handleSelectChange={setProject} />
              <DatePicker
                value={dataInicio}
                handleChangeDate={setDataInicio}
                id={'data_inicio'}
                label={'Data inicial'}
              />
              <DatePicker
                value={dataFim}
                handleChangeDate={setDataFim}
                id={'data_fim'}
                label={'Data final'}
              />
            </Paper>
          </Grid>
        </Container>
        <SwipeableViews
          axis='x'
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
          style={{width: '100%'}}
        >
          <Desempenho atendimentos={atendimentos} misunderstoodMessages={misunderstoodMessages} />
          <NPS atendimentos={atendimentos} />
          <Nodes nodeCount={nodeCount} />
        </SwipeableViews>
      </main>
    </div>
  );
}