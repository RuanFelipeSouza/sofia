import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { verify } from 'jsonwebtoken';
import { func } from 'prop-types';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // here you should write the logic to enter the protected route
  return (
    <Route
      {...rest}
      render={props => localStorage.getItem('token') !== null ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  component: func
};