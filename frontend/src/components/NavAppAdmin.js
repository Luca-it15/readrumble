import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {blue, red} from "@mui/material/colors";

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
        <AppBar position="sticky">
            <Toolbar sx={{justifyContent: 'center'}}>
                <Typography variant="h4" sx={{color: '#0090FF'}}>R</Typography>
                <Typography variant="h4">ead</Typography>
                <Typography variant="h4" sx={{color: '#FE262F'}}>R</Typography>
                <Typography variant="h4" sx={{flexGrow: 1}}>umble</Typography>
                <Typography variant="h4" component="div" sx={{flexGrow: 1}}>
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
                <Button color="inherit" onClick={handleClickOpen}>
                    Logout
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
