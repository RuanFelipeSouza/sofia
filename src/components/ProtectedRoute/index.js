import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { verify } from 'jsonwebtoken';
import { func } from 'prop-types';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // here you should write the logic to enter the protected route
  let logged = false;
  try {
    const jwt = localStorage.getItem('Authorization');
    verify(jwt, 'intelliway-secret');
    logged = true;
  } catch (e) {
    logged = false;
  }

  return (
    <Route
      {...rest}
      render={props =>
        logged === true ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  component: func
};