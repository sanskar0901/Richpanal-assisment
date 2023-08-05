import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import cookie from 'js-cookie';

const ProtectedRoute = ({ element, ...rest }) => {
    const isLoggedIn = cookie.get('isLoggedIn');

    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    return <Route element={element} {...rest} />;
};

export default ProtectedRoute;
