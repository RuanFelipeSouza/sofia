import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import IntelliLogs from './pages/IntelliLogs';
import Conversation from './pages/IntelliLogs/Conversation';
import IntelliChat from './pages/IntelliChat';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Login from './pages/Login';
import UploadCampaign from './pages/Campaign/UploadCampaign';
import ListCampaign from './pages/Campaign/ListCampaign';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/iframe" component={Assistant} />
        <Route exact path="/campanha/upload" component={UploadCampaign} />
        <Route exact path="/campanha/list" component={ListCampaign} />
        <ProtectedRoute path="/intellilogs" component={IntelliLogs} />
        <ProtectedRoute path="/conversation/:id" component={Conversation} />
        <ProtectedRoute path="/intellichat" component={IntelliChat} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="*" component={() => '404 NOT FOUND'} />
      </Switch>
    </BrowserRouter>
  );
}
