import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import image from '../img/emptyPage.jpg';
import CompetitionProfBlock from '../components/CompetitionBlock';
import { Grid, Paper } from '@mui/material';
const Home = () => {
    return (
        <Container sx={{alignItems: "center", display: "flex"}}>
            <Typography variant="h3" component="div">
                Benvenuto nella mia applicazione React!
            </Typography>
            <Typography variant="body1">
                There is something to see here, please stay here.
            </Typography>
            <Box>
                <img
                    src={image}
                    alt="Immagine della homepage"
                    loading="lazy"
                    width="200"
                />
            </Box>
        <Grid container spacing={2} sx={{textAlign:"center"}}>
            {/* Colonna 1 */}
            <Grid item xs={4}>
                <Paper><h1>Competitions</h1></Paper>
                <CompetitionProfBlock />
            </Grid>

            {/* Colonna 2 */}
            <Grid item xs={4}>
                <Paper><h1>Posts</h1></Paper>
            </Grid>

            {/* Colonna 3 */}
            <Grid item xs={4}>
                <Paper><h1>Friends books</h1></Paper>
            </Grid>
        </Grid>
        </Container>
    );
}

export default Home;
