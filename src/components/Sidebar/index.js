import React from 'react';
import { useHistory } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';

import LogoIntelliway from './../../assets/logo-intelliway-nova.png';

import { UpperLogo, BottomLogo } from './styles.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
}));

const _menuOptions = [
  {
    label: 'IntelliLogs',
    iconName: 'assignment_rounded',
    path: '/intellilogs',
  },
  {
    label: 'IntelliChat',
    iconName: 'question_answer',
    path: '/intellichat',
  },
  {
    label: 'Dashboard',
    iconName: 'assessment_rounded',
    path: '/dashboard',
  },
  {
    label: 'Configurações',
    iconName: 'settings',
    path: '/settings',
  },
];

export default function Sidebar() {
  const history = useHistory();
  const location = history.location.pathname;
  const classes = useStyles();

  const _redirect = (path) => path !== location ? history.push(path) : null;

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <UpperLogo src={LogoIntelliway} alt={'logo da intelliway'} />
      <Divider />
      <List>
        {
          _menuOptions.map(({ label, iconName, path }) => (
            <ListItem button key={label} onClick={() => _redirect(path)}>
              <ListItemIcon>
                <Icon className={classes.icon}>{iconName}</Icon>
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))
        }
      </List>
      <BottomLogo className={'logoInferior'} src={LogoIntelliway} />
    </Drawer>
  );
}
