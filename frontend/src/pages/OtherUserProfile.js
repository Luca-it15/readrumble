import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {Container, Grid, Typography, Paper} from '@mui/material';
import Button from '@mui/material-next/Button';
import PostsList from '../components/PostList';
import axios from "axios";
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import PersonRemoveTwoToneIcon from '@mui/icons-material/PersonRemoveTwoTone';
import {blue, green, red} from "@mui/material/colors";
import {useParams} from "react-router-dom";
import CompetitionProfBlock from '../components/CompetitionBlock';
import RecentlyReadBooks from "../components/RecentlyReadBooks";
import CurrentlyReading from "../components/CurrentlyReading";
import GoBack from '../components/GoBack';

function OtherUserProfile() {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const {username} = useParams();

    const [isFollowing, setIsFollowing] = useState(currentUser['following'].includes(username));

    const [userInfo, setUserInfo] = useState([]);

    console.log("Landed on " + username + "'s profile");
    console.log("isFollowing: " + isFollowing);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 18,
        width: '100%'
    }

    async function fetchUserInformation() {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${username}`);
            setUserInfo(JSON.parse(response.data));
            console.log("Received: " + response.data)
        } catch (error) {
            console.log(error.response)
        }

        setIsFollowing(currentUser['following'].includes(username))
    }

    useEffect(() => {
        fetchUserInformation();
    }, [username]);

    // Toggle following status
    const toggleFollowing = async () => {
        try {
            if (isFollowing) {
                await axios.delete(`http://localhost:8080/api/follow/${currentUser['_id']}/${username}`);

                // Remove username from following list
                currentUser['following'].splice(currentUser['following'].indexOf(username), 1);
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            } else {
                await axios.post(`http://localhost:8080/api/unfollow/${currentUser['_id']}/${username}`);

                // Add username to following list
                currentUser['following'].push(username);
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <GoBack></GoBack>
                    <Grid item xs={8} md={5}>
                        <Profile {...userInfo} />
                    </Grid>
                    <Grid container xs={4} direction="column" alignItems="center" justifyContent="space-around">
                        <Grid item xs={6} md={5}>
                            {isFollowing ? (
                                <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: red[300]}}} variant="filledTonal" onClick={toggleFollowing}
                                        startIcon={<PersonRemoveTwoToneIcon/>}>
                                    <Typography>Unfollow</Typography>
                                </Button>
                            ) : (
                                <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: green[300]}}} variant="filledTonal" onClick={toggleFollowing}
                                        startIcon={<PersonAddTwoToneIcon/>}>
                                    <Typography>Follow</Typography>
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <CurrentlyReading user={username}/>
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={3} md={3}>
                    <FollowingList user={username}/>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Competitions</Typography>
                        <CompetitionProfBlock/>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Posts</Typography>
                        <PostsList/>
                    </Paper>
                </Grid>
                <Grid item xs={3} md={3}>
                    <FavoriteBookList user={username}/>
                    <RecentlyReadBooks user={username}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default OtherUserProfile;
