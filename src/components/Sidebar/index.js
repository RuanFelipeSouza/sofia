import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import AssessmentRoundedIcon from '@material-ui/icons/AssessmentRounded';
import ReorderIcon from '@material-ui/icons/Reorder';
import List from "@material-ui/core/List";
import Button from '@material-ui/core/Button';

import Logo from "./../../assets/logo1.png";
import LogoIntelliway from "./../../assets/logo-intelliway-nova.png";

import { UpperLogo, BottomLogo } from './styles.js';

const drawerWidth = 240;
const closedDrawerWidth = 40;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#F0703F',
    color: 'white',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  toggleButton: {
    color: 'white',
    width: '30px',
    margin: '0 0 0 auto',
    minWidth: '40px',
  },
  closedDrawer: {
    width: closedDrawerWidth,
    flexShrink: 0,
  },
  closedDrawerPaper: {
    width: closedDrawerWidth,
    backgroundColor: '#F0703F',
    color: 'white',
    overflow: 'hidden'
  },
  closedItem: {
    paddingLeft: '7px'
  }
}));

const _menuOptions = [
  {
    label: "IntelliLogs",
    icon: <AssignmentRoundedIcon style={{ color: 'white' }} />,
    path: '/intellilogs'
  },
  {
    label: "Curadoria",
    icon: <QuestionAnswerRoundedIcon style={{ color: 'white' }} />,
    children: [
      {
        label: "Planilhas",
        icon: <QuestionAnswerRoundedIcon style={{ color: 'white' }} />,
        path: '/curadoria/planilhas'
      },
      {
        label: "Responsáveis",
        icon: <QuestionAnswerRoundedIcon style={{ color: 'white' }} />,
        path: '/curadoria/responsaveis'
      },
    ]
  },
  {
    label: "Dashboard",
    icon: <AssessmentRoundedIcon style={{ color: 'white' }} />,
    path: '/dashboard'
  }
];

export default function Sidebar() {
  const history = useHistory();
  const location = history.location.pathname;
  const classes = useStyles();
  const [currentOpen, setCurrentOpen] = useState('');
  const [isOpen, setOpen] = useState(true);

  const _redirect = (path) => path !== location ? history.push(path) : null;

  const renderExpand = (children, label) => {
    if (!children) {
      return null;
    }

    return currentOpen === label ? <ExpandLess /> : <ExpandMore />
  };

  const handleClick = (label) => {
    if (label === currentOpen) {
      setCurrentOpen('');
    } else {
      setCurrentOpen(label);
    }
  };
  
  return isOpen ? (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Button className={classes.toggleButton} onClick={() => setOpen(value => !value)} ><ReorderIcon /></Button>
      <UpperLogo src={Logo} alt={"logo da Arcelor"} />
      <Divider />
      <List>
        {
          _menuOptions.map(({ label, icon, path, children }) => (
            <div key={label}>
              <ListItem button onClick={() => children ? handleClick(label) : _redirect(path)}>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
                {renderExpand(children, label)}
              </ListItem>
              {children &&
                <Collapse in={currentOpen === label} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {children.map(c => (
                      <ListItem button key={c.label} className={classes.nested} onClick={() => _redirect(c.path)}>
                        <ListItemIcon>
                          {c.icon}
                        </ListItemIcon>
                        <ListItemText primary={c.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>}
            </div>
          ))
        }
      </List>
      <BottomLogo className={"logoInferior"} src={LogoIntelliway} />
    </Drawer>
  ) : (
    <Drawer
      className={classes.closedDrawer}
      variant="permanent"
      classes={{
        paper: classes.closedDrawerPaper,
      }}
      anchor="left"
    >
      <Button className={classes.toggleButton} onClick={() => setOpen(value => !value)} ><ReorderIcon /></Button>
      <Divider />
      <List>
        {
          _menuOptions.map(({ label, icon, path, children }) => (
            <div key={label}>
              <ListItem button onClick={() => children ? handleClick(label) : _redirect(path)} className={classes.closedItem}>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                {renderExpand(children, label)}
              </ListItem>
            </div>
          ))
        }
      </List>
    </Drawer>
  );
}
