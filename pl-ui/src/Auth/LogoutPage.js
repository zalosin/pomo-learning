import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';

import { withAuthentication } from '../AuthContext';

export default withAuthentication(({ authentication }) => {
    authentication.logout();
    return (
        <Redirect to="/" />    
    );
});