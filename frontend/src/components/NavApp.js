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
        <AppBar position="sticky" sx={{backgroundColor: '#393939'}}>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block me-2"/>
                <Typography variant="h4" sx={{ color: '#0090FF' }}>R</Typography>
                <Typography variant="h4">ead</Typography>
                <Typography variant="h4" sx={{ color: '#FE262F' }}>R</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>umble</Typography>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/dashboard" exact>
                    <Typography>Home</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/explore">
                    <Typography>Explore</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/profile">
                    <Typography>Profile</Typography>
                </Button>
                <Button sx={{color: "#ffffff", width: "70px", height: "25px", backgroundColor: 'transparent',
                    '&:hover': {backgroundColor: red[500]}}} variant="filled" component={NavLink} to="/logout">
                    <Typography>Logout</Typography>
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavApp;
