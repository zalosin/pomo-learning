import React, { Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link as RouterLink } from 'react-router-dom';

import SpringModal from './Modal/Modal';

import './AppHeader.scss';

export default ({ userInfo }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    function handleProfileMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    return (
        <Fragment>
            <AppBar position="static">
                <Toolbar>
                    <RouterLink to="/">
                        <Typography variant="h6">
                            Pomo Learning
                        </Typography>
                    </RouterLink>
                    <Box ml="auto">
                        <SpringModal />
                        
                        {
                            !userInfo && 
                            <RouterLink to="/login">
                                <Button color="default">Login</Button>
                            </RouterLink>
                        }

                        {
                            userInfo && 
                            <IconButton
                                edge="end"
                                onClick={handleProfileMenuOpen}
                                style={{ color: 'white' }}
                            >
                                <AccountCircle />
                            </IconButton>
                        }
                    </Box>
                    
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id="menuId"
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <RouterLink to="/profile">
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                </RouterLink>
                <RouterLink to="/logout">
                    <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                </RouterLink>
            </Menu>
        </Fragment>
    );
};