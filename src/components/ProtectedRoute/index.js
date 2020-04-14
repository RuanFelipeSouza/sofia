import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // here you should write the logic to enter the protected route
  const logged = false;

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