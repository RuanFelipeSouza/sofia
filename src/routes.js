import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import IntelliLogs from './pages/IntelliLogs'
import IntelliChat from './pages/IntelliChat'
import Login from './pages/Login';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/intellilogs" component={IntelliLogs} />
                <Route path="/intellichat" component={IntelliChat} />
                <Route path="*" component={() => "404 NOT FOUND"} />
            </Switch>
        </BrowserRouter>
    );
}