import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import IntelliLogs from './pages/IntelliLogs'
import Conversation from './pages/IntelliLogs/Conversation'
import IntelliChat from './pages/IntelliChat'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Client from './pages/Client';
import Lawyers from './pages/Lawyer';
import Lawsuits from './pages/Lawsuits';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <ProtectedRoute path="/intellilogs" component={IntelliLogs} />
                <ProtectedRoute path="/conversation/:id" component={Conversation} />
                <ProtectedRoute path="/intellichat" component={IntelliChat} />
                <ProtectedRoute path="/clientes" component={Client} />
                <ProtectedRoute path="/advogados" component={Lawyers} />
                <ProtectedRoute path="/processos" component={Lawsuits} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="*" component={() => "404 NOT FOUND"} />
            </Switch>
        </BrowserRouter>
    );
}