import React from 'react';
import {Container, Grid, Typography, Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import {blue} from "@mui/material/colors";

import PopularCompetitionBlock from '../components/PopularCompetitionBlock';
import BookListQuery from "../components/BookListQuery";
import RecentFriendsPosts from '../components/RecentFriendsPosts';

const Home = () => {
    const currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        borderRadius: '30px',
        width: '100%',
        textAlign: 'center'
    }

    const navigate = useNavigate();

    function goPost() {
        navigate("/post");
    }


    console.log("Compeittions: " + JSON.stringify(currentUser['competitions']))

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle} sx={{marginTop: '10px'}}>
                <Typography variant="h5">Welcome, {currentUser['name']}!</Typography>
            </Paper>

            <Grid container spacing={2} textAlign="center" direction="row" alignItems="flex-start" justifyContent="space-around"
                sx={{paddingTop: '10px'}}>
                <Grid item xs={3}>
                    <PopularCompetitionBlock/>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={2} style={PaperStyle}>
                    <Button sx={{backgroundColor: blue[200], height: "40px", marginBottom: '10px',
                                '&:hover': {backgroundColor: blue[400]}}}
                                variant="filledTonal" onClick={goPost}
                                startIcon={<EditNoteTwoToneIcon sx={{color: blue[700]}}/>}>
                            <Typography>Make a post</Typography>
                        </Button>
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
