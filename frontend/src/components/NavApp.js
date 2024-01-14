import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material-next/Button';
import logo from '../img/logoRR.png';
import {red} from "@mui/material/colors";

const NavApp = () => {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block me-2"/>
                    ReadRumble
                </Typography>
                    <Button sx={{color: '#ffffff'}} component={NavLink} to="/dashboard" exact>
                        <Typography>Home</Typography>
                    </Button>
                    <Button sx={{color: '#ffffff'}} component={NavLink} to="/explore">
                        <Typography>Explore</Typography>
                    </Button>
                    <Button sx={{color: '#ffffff'}} component={NavLink} to="/profile">
                        <Typography>Profile</Typography>
                    </Button>
                    <Button sx={{color: "#ffffff", backgroundColor: red[300], width: "70px", height: "25px"}} variant="filled" component={NavLink} to="/logout">
                        <Typography>Logout</Typography>
                    </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavApp;
