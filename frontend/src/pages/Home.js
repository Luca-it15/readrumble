import React from 'react';
import {Container, Grid, Typography, Paper} from '@mui/material';
import PopularCompetitionBlock from '../components/PopularCompetitionBlock';
import BookListQuery from "../components/BookListQuery";
import RecentFriendsPosts from '../components/RecentFriendsPosts';

const Home = () => {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: '30px',
        width: '100%',
        textAlign: 'center'
    }

    const currentUser = JSON.parse(localStorage.getItem('logged_user'));

    console.log("Compeittions: " + JSON.stringify(currentUser['competitions']))

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Typography variant="h5">Welcome, {currentUser['name']}!</Typography>
            </Paper>
            <Grid container spacing={2} textAlign="center" direction="row" alignItems="flex-start" justifyContent="space-around">
                <Grid item xs={3}>
                    <PopularCompetitionBlock/>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Friends' posts</Typography>
                        <RecentFriendsPosts/>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <BookListQuery query={"friends"}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;
