import React from 'react';
import Profile from '../../components/Profile';
import BookList from '../BookList';
import {Container, Button, Grid, Typography} from '@mui/material';
import ReviewsList from '../../components/ReviewsList';
import CompetitionProfBlock from '../../components/CompetitionBlock';
var storedData = localStorage.getItem('logged_user');

// Verifica se il valore è presente
if (storedData) {
    // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
    var user = JSON.parse(storedData);

    // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
    console.log(user["Name"]);
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

const DashboardAdmin = () => {

    return (
        <Container maxWidth="xl">
            <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
                <Grid item xs={6} md={4}>
                    <Profile {...user} />
                </Grid>
                <Grid item xs={6} md={4}>
                    <Button variant="contained" onClick={goSettings}>Settings</Button>
                    <Button variant="contained" onClick={goDashboard}>Dashboard</Button>
                </Grid>
            </Grid>
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={4} md={4}>
                    <Typography variant="h3">Users</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Typography variant="h3">Competition</Typography>
                    <CompetitionProfBlock />
                </Grid>
                <Grid item xs={4} md={4}>
                    <Typography variant="h3">Review</Typography>
                    <Typography variant="h4">Show Review</Typography>
                    <Typography variant="h4">Delete Review</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Typography variant="h3">Book</Typography>
                    <Typography variant="h4">Show Books</Typography>
                    <Typography variant="h4">Add Book</Typography>
                    <Typography variant="h4">Update Book</Typography>
                    <Typography variant="h4">Delete Book</Typography>
                    
                </Grid>
            </Grid>
        </Container>
    );
}

export default DashboardAdmin;
