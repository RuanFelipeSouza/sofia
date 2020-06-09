import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Sidebar from './../../components/Sidebar';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { FavoriteBorder, Assignment, BarChart } from '@material-ui/icons';
import api from './../../services/api';
import NPS from './nps';
import Sugestoes from './sugestoes';
import Desempenho from './desempenho';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  main: {
    width: '87%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
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

export default function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [tabIndex, setTabValue] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [connections, setConnections] = useState([]);
  const [users, setUsers] = useState([]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  useEffect(_ => {
    api.get('/dashboard').then(response => {
      setSurveys(response.data.surveys);
      setConnections(response.data.connections);
      setUsers(response.data.users);
    })
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
            <Tab label="Central NPS" icon={<FavoriteBorder />} {...a11yProps(0)} />
            <Tab label="Central de sugestões" icon={<Assignment />} {...a11yProps(1)} />
            <Tab label="Central de desempenho" icon={<BarChart />} {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
          style={{width: '100%'}}
        >
          <NPS surveys={surveys.filter(e => e.nota)}/>
          <Sugestoes surveys={surveys.filter(e => e.nota)}/>
          <Desempenho surveys={surveys} connections={connections} users={users} />
        </SwipeableViews>
      </main>
    </div>
  );
}