import React from "react";
import SideNav, { Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useHistory } from 'react-router-dom';
import { FiMessageCircle, FiPieChart } from 'react-icons/fi';

import Logo from './../../assets/logo1.png'
import LogoIntelliway from './../../assets/logo-intelliway-nova.png'

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './styles.css';

export default function Sidebar() {
  const history = useHistory();
  const location = history.location.pathname.replace('/','');
  return (
    <React.Fragment>
      <SideNav
        expanded={true}
        onSelect={(selected) => {
          const to = `/${selected}`;
            if(location !== to)
              history.push(to);
        }}
        onToggle={_ => {}}
      >
        {/* <Toggle /> */}
        <img className={"logoSuperior"} src={Logo} alt={""} />
        <Nav defaultSelected={location}>
          <NavItem eventKey="intellilogs">
            <NavIcon>
                <FiMessageCircle size={18} color="#FFF" />
            </NavIcon>
            <NavText>
              IntelliLogs
            </NavText>
          </NavItem>
          <NavItem eventKey="intellichat">
            <NavIcon>
                <FiMessageCircle size={18} color="#FFF" />
            </NavIcon>
            <NavText>
              IntelliChat
            </NavText>
          </NavItem>
          <NavItem eventKey="dashboard">
            <NavIcon>
                <FiPieChart size={18} color="#FFF" />
            </NavIcon>
            <NavText>
              Dashboard
            </NavText>
          </NavItem>
        </Nav>
        <img className={"logoInferior"} src={LogoIntelliway} alt={""} />
      </SideNav>
    </React.Fragment>
  );
}