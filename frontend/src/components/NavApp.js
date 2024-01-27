import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material-next/Button';
import logo from '../img/logoRR.png';
import {blue, orange, red} from "@mui/material/colors";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const NavApp = () => {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogout = () => {
        navigate("/");
        window.location.reload();
        localStorage.clear();
    }

    return (
        <AppBar position="sticky" sx={{backgroundColor: '#393939'}}>
            <Toolbar sx={{justifyContent: 'center'}}>
                <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block me-2"/>
                <Typography variant="h4" sx={{
                    fontWeight: 'bold',
                    background: "linear-gradient(to bottom," + blue[200] + ", #0080DD 70%)",
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>R</Typography>
                <Typography variant="h4">ead</Typography>
                <Typography variant="h4" sx={{
                    fontWeight: 'bold',
                    background: "linear-gradient(to bottom," + orange[300] + ", #FE262F 70%)",
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>R</Typography>
                <Typography variant="h4" sx={{flexGrow: 1}}>umble</Typography>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/home" exact>
                    <Typography>Home</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/explore">
                    <Typography>Explore</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/profile">
                    <Typography>Profile</Typography>
                </Button>
                <Button sx={{
                    color: "#ffffff", width: "70px", height: "25px", backgroundColor: 'transparent',
                    marginLeft: '40px',
                    '&:hover': {backgroundColor: red[500]}
                }} variant="filled" onClick={handleClickOpen}>
                    <Typography>Logout</Typography>
                </Button>

                <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title"><Typography variant='h5'>Confirm
                        logout</Typography></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography>Are you sure you want to logout?</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            sx={{color: '#ffffff', backgroundColor: blue[500], '&:hover': {backgroundColor: blue[300]}}}
                            onClick={handleClose} variant="filledTonal">
                            <Typography>No, go back</Typography>
                        </Button>
                        <Button sx={{
                            color: blue[600], backgroundColor: 'transparent', '&:hover': {
                                backgroundColor: red[200],
                                color: '#ffffff'
                            }
                        }} onClick={handleLogout} variant="filledTonal">
                            <Typography>Yes, bye</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Toolbar>
        </AppBar>
    );
};

export default NavApp;
