import React from 'react';
import { Route, Redirect } from 'react-router-dom'

export default ({ component: Component, ...rest }) => {
    const userInfo = localStorage.getItem('userInfo');

    const render = (props) => {
        if (!userInfo) {
            return <Redirect to='/login' />;
        }

        props.userInfo = userInfo;
        return <Component {...props} />;
    }

    return (
        <Route {...rest} render={render} />
    );
};