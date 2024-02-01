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
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        if (currentUser['wishlist'] && currentUser['wishlist'].length > 0) {
            setBooks(currentUser['wishlist']);
        } else {
            try {
                const response = await axios.get(`http://localhost:8080/api/book/wishlist/${currentUser['_id']}`)

                const booksData = response.data.map(book => ({
                    id: book.id,
                    title: book.title.replace(/"/g, '')
                }));

                setBooks(booksData);
                currentUser['wishlist'] = booksData;

                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            } catch (error) {
                console.log(error.response)
            }
        }
    };

    const removeFromWishlist = async (book) => {
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
        return window.location.href = "http://localhost:3000/dashboard";
    }

    function goPost() {
       navigate("/post");
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
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
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100% !important',
            gap: '15px', marginTop: '10px'}}>
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

            <Grid container textAlign="center" direction="row" alignItems="flex-start" justifyContent="space-betwwen"
                spacing={1}>
                <Grid container item xs={3} direction="column" alignItems="center" justifyContent="center" spacing={1}>
                    <Grid item xs={12} sx={{width: '100%'}}>
                        <FollowingList user={currentUser['_id']}/>
                    </Grid>
                    <Grid item xs={12} sx={{width: '100%'}}>
                        <CompetitionProfBlock user={currentUser['_id']}/>
                    </Grid>
                </Grid>

                <Grid container item xs={6} direction="column" alignItems="center" justifyContent="center">
                    <Paper elevation={2} style={PaperStyle} sx={{marginBottom: '20px'}}>
                        <Typography variant="h5">Posts</Typography>
                        <Button sx={{backgroundColor: blue[200], height: "40px", marginBottom: '10px',
                                '&:hover': {backgroundColor: blue[100]}}}
                                variant="filledTonal" onClick={goPost}
                                startIcon={<EditNoteTwoToneIcon sx={{color: blue[700]}}/>}>
                            <Typography>Make a post</Typography>
                        </Button>
                        <PostsList user={true} username={currentUser['_id']} size={12} all={false} path={1}/>
                    </Paper>
                </Grid>

                <Grid container item xs={3} direction="column" alignItems="center" justifyContent="center" spacing={1}>
                    <Grid item sx={{width: '100%'}}>
                        <FavoriteBookList user={currentUser['_id']}/>
                    </Grid>
                    <Grid item sx={{width: '100%'}}>
                        <RecentlyReadBooks user={currentUser['_id']}/>
                    </Grid>
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
