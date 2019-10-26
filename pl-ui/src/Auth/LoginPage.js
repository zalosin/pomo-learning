import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Api from '../Api';

import './LoginPage.scss';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.login = this.login.bind(this);
    }

    changeEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    changePassword = (e) => {
        this.setState({ password: e.target.value });
    }

    login() {
        const { history } = this.props;

        Api.post('login', {
            username: this.state.email,
            password: this.state.password,
        }).then(json => {
            if (json.status) {
                localStorage.setItem('userInfo', JSON.stringify(json.data));
                history.replace('/');
            } else {
                alert(json.message);
            }
        });
    }

    render = () => {
        const { email, password } = this.state;

        return (
            <Grid container alignContent="center" direction="column">
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <form noValidate>
                    <TextField
                        value={email}
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
                        value={password}
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
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={!email || !password}
                        onClick={this.login}
                    >
                        Log In
                        </Button>
                </form>
            </Grid>
        );
    }
}

export default withRouter(LoginPage);