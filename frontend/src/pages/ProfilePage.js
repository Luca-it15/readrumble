import React from 'react';
import Profile from '../components/Profile';
import {Link} from 'react-router-dom';

import UserSettings from './UserSettings';
import BookList from './BookList';

import { Container, Grid, Button, Typography } from '@mui/material';
import '../App.css'
import {BrowserRouter, Route, Routes, Navigate, redirect} from 'react-router-dom';

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

const ProfilePage = () => {

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                    <Profile {...user} />
                </Grid>
                <Grid item xs={6} md={6}>
                    <Button variant="contained" color="primary" onClick={goSettings}>Settings</Button>
                    <Button variant="contained" color="primary" onClick={goDashboard}>Dashboard</Button>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Typography variant="h4">Competizioni</Typography>
                    <Typography variant="h4">Amici</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Typography variant="h4">Post</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Typography variant="h4">Libri Preferiti</Typography>
                    <Typography variant="h4">Libri Letti</Typography>
                    <Typography variant="body1">10 libri a caso:</Typography>
                    <BookList/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProfilePage;
