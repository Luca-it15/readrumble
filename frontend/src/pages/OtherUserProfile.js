import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {Container, Grid, Typography, Paper, DialogTitle, DialogContent, List, ListItem, Link, Divider, DialogActions, Dialog} from '@mui/material';
import Button from '@mui/material-next/Button';
import PostsList from '../components/PostList';
import axios from "axios";
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import PersonRemoveTwoToneIcon from '@mui/icons-material/PersonRemoveTwoTone';
import {blue, green, red} from "@mui/material/colors";
import {useNavigate, useParams} from "react-router-dom";
import CompetitionProfBlock from '../components/CompetitionBlock';
import RecentlyReadBooks from "../components/RecentlyReadBooks";
import CurrentlyReading from "../components/CurrentlyReading";
import GoBack from '../components/GoBack';
import BookmarkTwoToneIcon from "@mui/icons-material/BookmarkTwoTone";

function OtherUserProfile() {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const {username} = useParams();
    const [open, setOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(currentUser['following'].includes(username));
    const [userInfo, setUserInfo] = useState([]);
    const [books, setBooks] = useState([]);

    const navigate = useNavigate();

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 18,
        width: '100%'
    }

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    async function fetchUserInformation() {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${username}`);
            setUserInfo(response.data);
        } catch (error) {
            console.log(error.response)
        }

        setIsFollowing(currentUser['following'].includes(username))
    }

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/wishlist/${username}`)

            const booksData = response.data.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            }));

            setBooks(booksData);
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        fetchUserInformation();
        fetchWishlist();
    }, [username]);

    // Toggle following status
    const toggleFollowing = async () => {
        try {
            if (isFollowing) {
                await axios.delete(`http://localhost:8080/api/unfollow/${currentUser['_id']}/${username}`);

                // Remove username from following list
                currentUser['following'].splice(currentUser['following'].indexOf(username), 1);
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            } else {
                await axios.post(`http://localhost:8080/api/follow/${currentUser['_id']}/${username}`);

                // Add username to following list
                currentUser['following'].push(username);
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error(error);
        }
    };

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`)
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <GoBack/>
                    <Grid item xs={8} md={5}>
                        <Profile {...userInfo} />
                    </Grid>
                    <Grid container xs={4} direction="row" alignItems="center" justifyContent="space-evenly">
                        <Grid item xs={6} md={5}>
                            <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={setOpen}
                                    startIcon={<BookmarkTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Wishlist</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={5}>
                            {isFollowing ? (
                                <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: red[300]}}}
                                        variant="filledTonal" onClick={toggleFollowing}
                                        startIcon={<PersonRemoveTwoToneIcon/>}>
                                    <Typography>Unfollow</Typography>
                                </Button>
                            ) : (
                                <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: green[300]}}}
                                        variant="filledTonal" onClick={toggleFollowing}
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
                <Grid container item xs={3} md={3} direction="column" spacing={1} sx={{marginTop: '2px'}}>
                    <Grid item>
                        <FollowingList user={username}/>
                    </Grid>
                    <Grid item>
                        <CompetitionProfBlock user={username}/>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Posts</Typography>
                        <PostsList user={true} username={username} size={12} all={false} path={1}/>
                    </Paper>
                </Grid>

                <Grid container item xs={3} md={3} direction="column" spacing={1} sx={{marginTop: '2px'}}>
                    <Grid item>
                        <FavoriteBookList user={username}/>
                    </Grid>
                    <Grid item>
                        <RecentlyReadBooks user={username}/>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={open} fullWidth={true}>
                <DialogTitle><Typography variant="h5" textAlign="center">{username}'s wishlist</Typography></DialogTitle>
                <DialogContent>
                    <List sx={ListStyle}>
                        {books.length === 0 ? (
                            <ListItem>
                                <Typography>No books to show</Typography>
                            </ListItem>
                        ) : (
                            books.map((book, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                        <Link onClick={() => {seeDetails(book.id)}} sx={{color: "#000000"}}>
                                            <Typography>{book.title}</Typography>
                                        </Link>
                                    </ListItem>
                                    <Divider variant="middle" component="li"/>
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </DialogContent>
                <DialogActions sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button
                        sx={{color: '#ffffff', backgroundColor: blue[500], '&:hover': {backgroundColor: blue[300]}}}
                        onClick={() => {setOpen(false)}} variant="filledTonal">
                        <Typography>Close</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default OtherUserProfile;
