import React from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {Container, Grid, Typography, Paper} from '@mui/material';
import Button from '@mui/material-next/Button';
import PostsList from '../components/PostList';
import CompetitionProfBlock from '../components/CompetitionBlock';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import LeaderboardTwoToneIcon from '@mui/icons-material/LeaderboardTwoTone';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import {blue} from "@mui/material/colors";
import RecentlyReadBooks from "../components/RecentlyReadBooks";
import CurrentlyReading from "../components/CurrentlyReading";

let currentUser = localStorage.getItem('logged_user');
// Verifica se il valore è presente
if (currentUser) {
    // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
    currentUser = JSON.parse(currentUser);
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
    return window.location.href = "http://localhost:3000/post";
}

const PaperStyle = {
    backgroundColor: '#f1f7fa',
    padding: '10px',
    margin: '20px 10px 0px 10px',
    borderRadius: 18,
    width: '100%'
}

const ProfilePage = () => {

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item xs={8} md={5}>
                        <Profile {...currentUser} />
                    </Grid>
                    <Grid container xs={4} direction="row" alignItems="center">
                        <Grid item xs={6} md={5}>
                            <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={goSettings}
                                    startIcon={<SettingsTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Settings</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={5}>
                            <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={goDashboard}
                                    startIcon={<LeaderboardTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Dashboard</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <CurrentlyReading user={currentUser['_id']}/>

            <Grid container spacing={3} textAlign="center">
                <Grid item xs={3} md={3}>
                    <FollowingList user={currentUser['_id']}/>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h4">Competitions</Typography>
                        <CompetitionProfBlock/>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Posts</Typography>
                        <Button sx={{backgroundColor: blue[200], height: "40px", '&:hover': {backgroundColor: '#23d984'}}}
                                variant="filledTonal" onClick={goReview}
                                startIcon={<EditNoteTwoToneIcon sx={{color: blue[700]}}/>}>
                            <Typography>Make a post!</Typography>
                        </Button>
                        {/* TODO (Luca o anche Francesco): aggiungere parametro user a ReviewList e gestirlo lì */}
                        <PostsList user={true} username={currentUser['_id']} size={12} all={false} path={1}/>
                    </Paper>
                </Grid>
                <Grid item xs={3} md={3}>
                    {/* Wishlist ? */}
                    <FavoriteBookList user={currentUser['_id']}/>
                    <RecentlyReadBooks user={currentUser['_id']}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProfilePage;
