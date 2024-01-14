import React from 'react';
import Button from '@mui/material-next/Button';
import Box from '@mui/material/Box';
import {red} from "@mui/material/colors";
import Typography from "@mui/material/Typography";

const Logout = ({onLogout}) => {
    const handleLogout = () => {
        // Imposta la variabile di stato per abilitare il reindirizzamento
        // Se la conferma è avvenuta, reindirizza l'utente alla pagina di login
        onLogout();
        window.location.href = 'http://localhost:3000/';
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20vh',
            }}
        >
            <Button sx={{backgroundColor: red[300], color: "#ffffff"}} variant="contained" color="primary" onClick={handleLogout}>
                <Typography>Logout</Typography>
            </Button>
        </Box>
    );
};

export default Logout;
