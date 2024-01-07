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

const NavApp = () => {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block me-2"/>
                    ReadRumble
                </Typography>
                    <Button color="inherit" component={NavLink} to="/dashboard" exact>
                        Home
                    </Button>
                    <Button color="inherit" component={NavLink} to="/explore">
                        Explore
                    </Button>
                    <Button color="inherit" component={NavLink} to="/profile">
                        Profile
                    </Button>
                    <Button color="warning" component={NavLink} to="/logout">
                        Logout
                    </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavApp;
