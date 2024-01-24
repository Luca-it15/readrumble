import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {blue, red} from "@mui/material/colors";
import logo from '../img/logoRR.png';
import Button from '@mui/material-next/Button';

const NavAppAdmin = () => {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogout = () => {
        navigate("/login");
        window.location.reload();
        localStorage.clear();
    }

    return (
        <AppBar position="sticky" sx={{backgroundColor: '#063156'}}>
            <Toolbar sx={{justifyContent: 'center'}}>
                <img src={logo} alt="Logo" width="60" height="60" className="d-inline-block me-2"/>
                <Typography variant="h4" sx={{color: '#0090FF'}}>R</Typography>
                <Typography variant="h4">ead</Typography>
                <Typography variant="h4" sx={{color: '#FE262F'}}>R</Typography>
                <Typography variant="h4" sx={{flexGrow: 1}}>umble</Typography>
                <Typography variant="h5" sx={{flexGrow: 1}}>
                    Administrator
                </Typography>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/dashboard" exact>
                    <Typography>Home</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/admin_post">
                    <Typography>Posts</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/admin_user">
                    <Typography>Users</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/admin_competition">
                    <Typography>Competitions</Typography>
                </Button>
                <Button sx={{color: '#ffffff'}} component={NavLink} to="/admin_book">
                    <Typography>Books</Typography>
                </Button>
                <Button sx={{color: '#ffffff', width: "70px", height: "25px", backgroundColor: 'transparent',
                    '&:hover': {backgroundColor: red[500]}}} onClick={handleClickOpen}>
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
                        <Button sx={{color: blue[600], backgroundColor: 'transparent', '&:hover': {backgroundColor: red[200],
                                color: '#ffffff'}}} onClick={handleLogout} variant="filledTonal">
                            <Typography>Yes, bye</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Toolbar>
        </AppBar>
    );
};

export default NavAppAdmin;
