import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Intellilogs from './pages/IntelliLogs'
import Intellichat from './pages/IntelliChat'
import Login from './pages/Login';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/intellilogs" component={Intellilogs} />
                <Route path="/intellichat" component={Intellichat} />
                <Route path="*" component={() => "404 NOT FOUND"} />
            </Switch>
        </BrowserRouter>
    );
}