import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const Error = () => {
    return (
        <Container>
            <Typography variant="h2" component="div">
                Error 404 page not found
            </Typography>
            <Box sx={{ width: 500, height: 450 }}>
                <ImageList variant="masonry" cols={3} gap={8}>
                    <ImageListItem>
                        <img
                            src="/static/images/image-list/breakfast.jpg"
                            srcSet="/static/images/image-list/breakfast.jpg"
                            alt="Immagine della homepage"
                            loading="lazy"
                        />
                    </ImageListItem>
                </ImageList>
            </Box>
        </Container>
    );
}

export default Error;
