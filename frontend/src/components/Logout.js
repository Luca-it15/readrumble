import React , {useState} from 'react';
import Button from '@mui/material-next/Button';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {red, blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import {Paper, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import GoBack from './GoBack';

const Logout = ({onLogout}) => {

    const navigate = useNavigate(); 

    const handleLogout = () => {
        // Imposta la variabile di stato per abilitare il reindirizzamento
        // Se la conferma è avvenuta, reindirizza l'utente alla pagina di login
        onLogout();
        navigate("/"); 
    }

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10%',
        borderRadius: 5,
        border: '3pt inset ' + blue[400]
    }

    return (
    <Paper sx={PaperStyle}>
        <Grid container xs={12} textAlign="center">
            <GoBack />
              <Typography variant='h3' sx={{textAlign: 'center'}}>Logout</Typography>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20vh',
            }}
        >
            <Button sx={{backgroundColor: red[500], color: "#ffffff"}} variant="contained" color="primary" onClick={handleClickOpen}>
                <Typography>Logout</Typography>
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Conferma eliminazione"}</DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                      Sei sicuro di fare Logout?
                  </DialogContentText>
              </DialogContent>
               <DialogActions>
                    <Button onClick={handleClose}>
                    <Typography>Annulla</Typography>
                      </Button>
                    <Button onClick={handleLogout} >
                        <Typography>Conferma</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
     </Grid>
     </Paper>
    );
};

export default Logout;
