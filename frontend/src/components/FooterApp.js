import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const FooterApp = () => {
    return (
        <Box sx={{ backgroundColor: grey[900], color: grey[50], p: 3, height: '70px', marginTop: 'auto', width: '100%'}}>
            <Typography align="center">
                Powered by Luca Chiocchetti, Francesco Pio Crispino and Massimiliano Romani
            </Typography>
        </Box>
    );
};

export default FooterApp;
