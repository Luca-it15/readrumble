import React from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {Container, Grid, Typography, Paper} from '@mui/material';
import Button from '@mui/material-next/Button';
import ReviewsList from '../components/PostList';
import CompetitionProfBlock from '../components/CompetitionBlock';
import BookListShow from '../components/BookListShow';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import LeaderboardTwoToneIcon from '@mui/icons-material/LeaderboardTwoTone';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import {blue} from "@mui/material/colors";

var currentUser = localStorage.getItem('logged_user');

// Verifica se il valore è presente
if (currentUser) {
    // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
    currentUser = JSON.parse(currentUser);

    // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
    console.log(currentUser["name"]);
    console.log(currentUser["_id"]);
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

const PaperStyle = {
    backgroundColor: '#f1f7fa',
    padding: '10px',
    margin: '10px',
    borderRadius: 18,
    width: '100%'
}

const ProfilePage = () => {

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item xs={6} md={4}>
                        <Profile {...currentUser} />
                    </Grid>
                    <Grid container xs={6} direction="column" alignItems="center" justifyContent="space-around">
                        <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                variant="filledTonal" onClick={goSettings} startIcon={<SettingsTwoToneIcon/>}>
                            <Typography>Settings</Typography>
                        </Button>
                        <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                variant="filledTonal" onClick={goDashboard} startIcon={<LeaderboardTwoToneIcon/>}>
                            <Typography>Dashboard</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={4} md={4}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h4">Users you follow</Typography>
                        <FollowingList user={currentUser['_id']}/>
                    </Paper>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h4">Competitions</Typography>
                        <CompetitionProfBlock/>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h4">Post</Typography>
                        <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                variant="filledTonal" onClick={goReview} startIcon={<EditNoteTwoToneIcon/>}>
                            <Typography>Make a post</Typography>
                        </Button>
                        {/* TODO (Luca o anche Francesco): aggiungere parametro user a ReviewList e gestirlo lì */}
                        <ReviewsList/>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h4">Your favorite books</Typography>
                        <FavoriteBookList user={currentUser['_id']}/>
                    </Paper>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h4">Books you have read</Typography>
                        <Typography>10 random books:</Typography>
                        <BookListShow/>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProfilePage;
