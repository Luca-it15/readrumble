import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import GoBack from "../components/GoBack";

const Error = () => {
    return (
        <Container>
            <Typography variant="h2" sx={{marginTop: '10vh'}}>
                Error 404: page not found
            </Typography>
            <Typography variant="h4" sx={{marginTop: '5vh'}}>
                Go back: <GoBack/>
            </Typography>
        </Container>
    );
}

export default Error;
