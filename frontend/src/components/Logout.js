import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
            </Button>
        </Box>
    );
};

export default Logout;
