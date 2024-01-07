import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import image from '../img/emptyPage.jpg';

const Home = () => {
    return (
        <Container sx={{alignItems: "center", display: "flex"}}>
            <Typography variant="h3" component="div">
                Benvenuto nella mia applicazione React!
            </Typography>
            <Typography variant="body1">
                There is nothing to see here, please move along.
            </Typography>
            <Box>
                <img
                    src={image}
                    alt="Immagine della homepage"
                    loading="lazy"
                    width="200"
                />
            </Box>
        </Container>
    );
}

export default Home;
