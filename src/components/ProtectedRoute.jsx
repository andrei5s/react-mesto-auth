/*import React from 'react';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ loggedIn, children }) => {
  return loggedIn ? children : <Redirect to='/sign-in' />
}

export default ProtectedRoute;*/

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...props }) => {
	return <Route>{() => (props.loggedIn ? <Component {...props} /> : <Redirect to="/sign-in" />)}</Route>;
};

export default ProtectedRoute;