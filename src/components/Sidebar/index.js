import React from "react";
import { useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
// import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import AssessmentRoundedIcon from '@material-ui/icons/AssessmentRounded';
import List from "@material-ui/core/List";

import Logo from "./../../assets/logo1.png";
import LogoIntelliway from "./../../assets/logo-intelliway-nova.png";

import { UpperLogo, BottomLogo } from './styles.js';

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#F0703F',
    color: 'white',
  },
}));

const _menuOptions = [
  {
    label: "IntelliLogs",
    icon: <AssignmentRoundedIcon style={{ color: 'white' }} />,
    path: '/intellilogs',
  },
  // {
  //   label: "IntelliChat",
  //   icon: <QuestionAnswerRoundedIcon style={{ color: 'white' }} />,
  //   path: '/intellichat',
  // },
  {
    label: "Dashboard",
    icon: <AssessmentRoundedIcon style={{ color: 'white' }} />,
    path: '/dashboard',
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
      <UpperLogo src={Logo} alt={"logo da Arcelor"} />
      <Divider />
      <List>
        {
          _menuOptions.map(({ label, icon, path }) => (
            <ListItem button key={label} onClick={() => _redirect(path)}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))
        }
      </List>
      <BottomLogo className={"logoInferior"} src={LogoIntelliway} />
    </Drawer>
  );
}
