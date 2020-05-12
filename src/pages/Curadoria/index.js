import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Sidebar from '../../components/Sidebar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Copyright from '../../components/Copyright';
import Table from './Table';

import api from '../../services/api'

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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    minWidth: '120%'
  },
  main: {
    minWidth: '100%'
	}
}));

export default function FullWidthTabs() {
  const classes = useStyles();
	const [curadorias, setCuradorias] = useState([]);
  const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.get('/curadoria').then(result => {
      setCuradorias(result.data);
      setLoading(false);
		});
	}, []);
	
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
        <main className={classes.main}>
                <AppBar position="static" color="default">
                    <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                        <Tab label="BOT 1" {...a11yProps(0)} />
                        <Tab label="BOT 2" {...a11yProps(1)} />
                        <Tab label="BOT 3" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <Table botName={'BOT 1'} curadorias={curadorias} setCuradorias={setCuradorias} loading={loading} />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <Table botName={'BOT 2'} curadorias={curadorias} setCuradorias={setCuradorias} loading={loading} />
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <Table botName={'BOT 3'} curadorias={curadorias} setCuradorias={setCuradorias} loading={loading} />
                    </TabPanel>
                </SwipeableViews>
            <Box pt={4}>
                <Copyright />
            </Box>
        </main>
    </div>
  );
}