import React from 'react';
import { Redirect, Route } from 'react-router-dom';

/*function ProtectedRoute({ component: Component, ...props }) {
  return (
    <Route>
      {props.loggedIn ? <Component {...props} /> : <Redirect to='/sign-in' />}
    </Route>
  )
}*/

const ProtectedRoute = ({ loggedIn, children }) => {
  return loggedIn ? children : <Redirect to='/sign-in' />
}

export default ProtectedRoute;