import React from 'react';
import Profile from '../components/Profile';
import BookList from '../components/BookList';
import FollowingList from '../components/FollowingList';
import {Container, Button, Grid, Typography, Paper} from '@mui/material';
import ReviewsList from '../components/ReviewsList';
import CompetitionProfBlock from '../components/CompetitionBlock';
import BookListShow from '../components/BookListShow';
var storedData = localStorage.getItem('logged_user');

// Verifica se il valore è presente
if (storedData) {
    // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
    var user = JSON.parse(storedData);

    // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
    console.log(user["name"]);
} else {
    // La chiave 'isLoggedIn' non è presente in localStorage
    console.log('La chiave "logged_user" non è presente in localStorage.');
}

function goSettings() {
    return window.location.href = "http://localhost:3000/settings";
}

function goDashboard() {
    return window.location.href = "http://localhost:3000/userDashboard";
}

function goReview() {
    return window.location.href = "http://localhost:3000/review";
}

const ProfilePage = () => {

    return (
        <Container maxWidth="xl">
            <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
                <Grid item xs={6} md={4}>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                        <Profile {...user} />
                    </Paper>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                        <Button variant="contained" onClick={goSettings}>Settings</Button>
                        <Button variant="contained" onClick={goDashboard}>Dashboard</Button>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                    <Typography variant="h4">Users you follow</Typography>
                        <FollowingList/>
                    </Paper>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                    <Typography variant="h4">Competizioni</Typography>
                        <CompetitionProfBlock />
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                    <Typography variant="h4">Post</Typography>
                    <Button variant="contained" onClick={goReview}>
                        Make Review
                    </Button>
                        <ReviewsList/>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                    <Typography variant="h4">Your favorite boooks</Typography>
                        <BookList/>
                    </Paper>
                    <Paper elevation={3} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px'}}>
                    <Typography variant="h4">Libri Letti</Typography>
                    <Typography variant="body1">10 libri a caso:</Typography>
                        <BookListShow/>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProfilePage;
