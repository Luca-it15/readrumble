import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import logo from '../img/logoRR.png';

const NavAppAdmin = () => {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block me-2"/>
                    ReadRumble
                </Typography>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Administrator
                </Typography>
                    <Button color="inherit" component={NavLink} to="/dashboard" exact>
                     Home
                    </Button>
                    <Button color="inherit" component={NavLink} to="/admin_post">
                       Posts
                    </Button>
                    <Button color="inherit" component={NavLink} to="/admin_user">
                        Users
                    </Button>
                    <Button color="inherit" component={NavLink} to="/admin_competition">
                      Competition
                    </Button>
                    <Button color="inherit" component={NavLink} to="/admin_book">
                     Book
                    </Button>
                    <Button color="inherit" component={NavLink} to="/logout">
                     Logout
                    </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavAppAdmin;
