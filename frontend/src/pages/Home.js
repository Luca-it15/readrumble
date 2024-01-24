import React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import image from '../img/emptyPage.jpg';
import {Container, Grid, Typography, Paper} from '@mui/material';
import PopularCompetitionBlock from '../components/PopularCompetitionBlock';
import BookListQuery from "../components/BookListQuery";
import RecentFriendsPosts from '../components/RecentFriendsPosts';
const Home = () => {
const PaperStyle = {
    backgroundColor: '#f1f7fa',
    padding: '10px',
    margin: '20px 10px 0px 10px',
    borderRadius: 18,
    width: '100%',
    textAlign:'center'
}
    return (
        /*<Container sx={{alignItems: "center", display: "flex"}}>
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

        </Container>*/
        <Container maxWidth="xl">
                    <Paper elevation={2} style={PaperStyle}>
                        <Grid container direction="row" justifyContent="space-around">
                            <Grid item xs={8} md={5}>
                                <Typography variant="h5">Welcome to the Homepage !</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container spacing={3} textAlign="center">
                        <Grid item xs={3} md={3}>

                            <Paper elevation={2} style={PaperStyle}>
                                <Typography variant="h5">Popular Competitions</Typography>
                                <PopularCompetitionBlock />
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Paper elevation={2} style={PaperStyle}>
                                <Typography variant="h5">Friends Posts</Typography>
                               <RecentFriendsPosts />
                            </Paper>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <BookListQuery query={"friends"}/>
                        </Grid>
                    </Grid>
                </Container>
    );
}

export default Home;
