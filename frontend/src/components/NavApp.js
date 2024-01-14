import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
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
                    <Button sx={{color: red[200], border: "2px solid", width: "80px", height: "30px"}} variant="outlined" component={NavLink} to="/logout">
                        <Typography>Logout</Typography>
                    </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavApp;
