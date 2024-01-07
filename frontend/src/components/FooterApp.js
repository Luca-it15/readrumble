import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const FooterApp = () => {
    return (
        <Box sx={{ bgcolor: grey[900], color: grey[50], p: 3 }}>
            <Typography variant="body1" align="center">
                powered by Luca Chiocchetti, Massimiliano Romani and Francesco Pio Crispino
            </Typography>
        </Box>
    );
};

export default FooterApp;
