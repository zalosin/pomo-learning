import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Api from '../Api';

import './LoginPage.scss';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }
    }

    changeEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    changePassword = (e) => {
        this.setState({ password: e.target.value });
    }

    login = () => {
        Api.post('login', {
            username: this.state.email,
            password: this.state.password,
        }).then(json => {
            if (json.status) {
                localStorage.setItem('userInfo', json.data);
            } else {
                alert('invalid credentials!');
            }
        });
    }

    render = () => {
        return (
            <Grid container alignContent="center" direction="column">
                <Typography component="h1" variant="h5">
                    Log in
                    </Typography>
                <form noValidate>
                    <TextField
                        value={this.state.email}
                        onChange={this.changeEmail}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        value={this.state.password}
                        onChange={this.changePassword} 
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={this.login}
                    >
                        Log In
                        </Button>
                </form>
            </Grid>
        );
    }
}