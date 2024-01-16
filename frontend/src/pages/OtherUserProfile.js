import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {Container, Grid, Typography, Paper} from '@mui/material';
import Button from '@mui/material-next/Button';
import ReviewsList from '../components/ReviewsList';
import CompetitionProfBlock from '../components/CompetitionBlock';
import BookListShow from "../components/BookListShow";
import axios from "axios";
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import PersonRemoveTwoToneIcon from '@mui/icons-material/PersonRemoveTwoTone';
import {blue} from "@mui/material/colors";
import {useParams} from "react-router-dom";

// !!! UNTESTED !!!

let currentUser = JSON.parse(localStorage.getItem('logged_user'));

function OtherUserProfile() {
    const {username} = useParams();

    const [isFollowing, setIsFollowing] = useState(currentUser &&
        currentUser['following'] && currentUser['following'].includes(username));

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
            /* TODO: funzione per ottenere le info dell'utente nel backend
               Io (Francesco) suggerirei di usare una funzione del tipo

               @GetMapping("/user/{username}")
               public User getNameAndSurname(@PathVariable String username) {
                   try {
                        MongoCollection<Document> collection = MongoConfig.getCollection("Users");
                        Document user = collection.find(eq("_id", username)).first();

                        return user;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
               }
             */
            const response = await axios.get(`http://localhost:8080/api/user/${username}`);
            setUserInfo(JSON.parse(response.data));
            console.log("Received: " + response.data)
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        fetchUserInformation();
    })

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
            <Paper elevation={3} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item xs={6} md={4}>
                        <Profile {...userInfo} />
                    </Grid>
                    <Grid container xs={6} direction="column" alignItems="center" justifyContent="space-around">
                        {isFollowing ? (
                            <Button sx={{color: blue[500]}} variant="filledTonal" onClick={toggleFollowing}
                                    startIcon={<PersonAddTwoToneIcon/>}>
                                <Typography>Follow</Typography>
                            </Button>
                        ) : (
                            <Button sx={{color: blue[500]}} variant="filledTonal" onClick={toggleFollowing}
                                    startIcon={<PersonRemoveTwoToneIcon/>}>
                                <Typography>Unfollow</Typography>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>
            <Grid container spacing={3} textAlign="center">
                <Grid item xs={4} md={4}>
                    <FollowingList user={username}/>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4">Competizioni</Typography>
                        <CompetitionProfBlock/>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Paper elevation={3} style={PaperStyle}>
                        <Typography variant="h4">Posts</Typography>
                        <ReviewsList/>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={4}>
                    <FavoriteBookList user={username}/>
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
