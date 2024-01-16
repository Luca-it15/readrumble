import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import { Container, Grid, Typography, Paper } from '@mui/material';
import Button from '@mui/material-next/Button';
import ReviewsList from '../components/PostList';
import CompetitionProfBlock from '../components/CompetitionBlock';
import BookListShow from "../components/BookListShow";
import axios from "axios";
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import PersonRemoveTwoToneIcon from '@mui/icons-material/PersonRemoveTwoTone';
import {blue} from "@mui/material/colors";

// !!! UNTESTED !!!

let currentUser = JSON.parse(localStorage.getItem('logged_user'));

const PaperStyle = {
    backgroundColor: '#f1f7fa',
    padding: '10px',
    margin: '10px',
    borderRadius: 18,
    width: '100%'
}

function OtherUserProfile({user}) {

    // If the user is in "following" list, then isFollowing is true
    const [isFollowing, setIsFollowing] = useState(currentUser['following'].includes(user));

    // Toggle following status
    const toggleFollowing = async () => {
        try {
            if (isFollowing) {
                await axios.delete(`/api/follow/${currentUser['_id']}/${user}`);

                // Remove user from following list
                currentUser['following'].splice(currentUser['following'].indexOf(user), 1);
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            } else {
                await axios.post(`/api/unfollow/${currentUser['_id']}/${user}`);

                // Add user to following list
                currentUser['following'].push(user);
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item xs={6} md={4}>
                        <Profile {...user} />
                    </Grid>
                    <Grid container xs={6} direction="column" alignItems="center" justifyContent="space-around">
                        {isFollowing ? (
                            <Button sx={{color: blue[500]}} variant="filledTonal" onClick={toggleFollowing} startIcon={ <PersonAddTwoToneIcon /> }>
                                <Typography>Follow</Typography>
                            </Button>
                        ) : (
                            <Button sx={{color: blue[500]}} variant="filledTonal" onClick={toggleFollowing} startIcon={ <PersonRemoveTwoToneIcon /> }>
                                <Typography>Unfollow</Typography>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4"></Typography>
                        <FollowingList user={user}/>
                    </Paper>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4">Competizioni</Typography>
                        <CompetitionProfBlock />
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4">Posts</Typography>
                        <ReviewsList/>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4">{user}'s favorite books</Typography>
                        <FavoriteBookList user={currentUser['_id']}/>
                    </Paper>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4">Read books</Typography>
                        {/* TODO: add ReadBooks component */}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default OtherUserProfile;
