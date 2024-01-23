import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {Container, Grid, Typography, Paper, List, ListItem, Tooltip, Link, Divider, Dialog, DialogTitle, DialogContent,
    DialogActions} from '@mui/material';
import Button from '@mui/material-next/Button';
import PostsList from '../components/PostList';
import CompetitionProfBlock from '../components/CompetitionBlock';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import LeaderboardTwoToneIcon from '@mui/icons-material/LeaderboardTwoTone';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import {blue, red} from "@mui/material/colors";
import RecentlyReadBooks from "../components/RecentlyReadBooks";
import CurrentlyReading from "../components/CurrentlyReading";
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    let currentUser = localStorage.getItem('logged_user');
    // Verifica se il valore è presente
    if (currentUser) {
        // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
        currentUser = JSON.parse(currentUser);
    } else {
        // La chiave 'isLoggedIn' non è presente in localStorage
        console.log('La chiave "logged_user" non è presente in localStorage.');
    }

    console.log(currentUser['competitions']);

    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    console.log(currentUser['favoriteBooks']);

    const fetchWishlist = async () => {
        if (currentUser['wihslist'] && currentUser['wihslist'].length > 0) {
            setBooks(currentUser['wihslist']);
            console.log(currentUser['wihslist'])
        } else {
            try {
                const response = await axios.get(`http://localhost:8080/api/book/wishlist/${currentUser['_id']}`);

                // Returns book.id and book.title
                setBooks(response.data.map(book => ({
                    id: book.id,
                    title: book.title.replace(/"/g, '')
                })));

                // Save all book ids in wishlist
                currentUser['wishlist'] = books;

                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            } catch (error) {
                console.log(error.response)
            }
        }
    };

    const removeFromWishlist = async (book) => {
        console.log("Removing book from wishlist: " + book.id);

        await axios.delete(`http://localhost:8080/api/book/removeFromWishlist/${currentUser["_id"]}/${book.id}`);

        // Remove book from wishlist
        currentUser['wishlist'] = currentUser['wishlist'].filter(wishlistBook => wishlistBook.id !== book.id);
        setBooks(currentUser['wishlist']);

        localStorage.setItem('logged_user', JSON.stringify(currentUser));
    }

    useEffect(() => {
        fetchWishlist();
    }, [currentUser['_id']]);

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`);
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

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="space-around">
                    <Grid item xs={4}>
                        <Profile {...currentUser} />
                    </Grid>
                    <Grid container xs={5} direction="row" alignItems="center">
                        <Grid item xs={4}>
                            <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={setOpen}
                                    startIcon={<BookmarkTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Wishlist</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button sx={{backgroundColor: blue[200], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={goSettings}
                                    startIcon={<SettingsTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Settings</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
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
                        <CompetitionProfBlock user={''}/>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Posts</Typography>
                        <Button sx={{backgroundColor: blue[200], height: "40px", '&:hover': {backgroundColor: blue[400]}}}
                                variant="filledTonal" onClick={goReview}
                                startIcon={<EditNoteTwoToneIcon sx={{color: blue[700]}}/>}>
                            <Typography>Make a post!</Typography>
                        </Button>
                        <PostsList user={true} username={currentUser['_id']} size={12} all={false} path={1}/>
                    </Paper>
                </Grid>
                <Grid item xs={3} md={3}>
                    <FavoriteBookList user={currentUser['_id']}/>
                    <RecentlyReadBooks user={currentUser['_id']}/>
                </Grid>
            </Grid>

            <Dialog open={open} fullWidth={true}>
                <DialogTitle><Typography variant="h5" textAlign="center">Your wishlist</Typography></DialogTitle>
                <DialogContent>
                    <List sx={ListStyle}>
                        {books.length === 0 ? (
                            <ListItem>
                                <Typography>No books to show</Typography>
                            </ListItem>
                        ) : (
                            books.map((book, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}
                                              secondaryAction={
                                                  <Tooltip title="Remove from wishlist">
                                                      <IconButton sx={{color: blue[500], '&:hover': {color: red[500]}}}
                                                                  onClick={() => removeFromWishlist(book)}>
                                                          <ClearIcon/>
                                                      </IconButton>
                                                  </Tooltip>
                                              }>
                                        <Link onClick={() => {
                                            seeDetails(book.id)
                                        }} sx={{color: "#000000"}}>
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

export default ProfilePage;
