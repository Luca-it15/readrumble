import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FollowingList from '../components/FollowingList';
import {
    Container, Grid, Typography, Paper, List, ListItem, Tooltip, Link, Divider, Dialog, DialogTitle, DialogContent,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
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
import PeopleIcon from '@mui/icons-material/PeopleAltTwoTone';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import FavoriteBookList from "../components/FavoriteBookList";
import {FavoriteTwoTone} from "@mui/icons-material";

const ProfilePage = () => {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [books, setBooks] = useState([]);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [recentlyReadOpen, setRecentlyReadOpen] = useState(false);
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followeesOpen, setFolloweesOpen] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [followees, setFollowees] = useState(0);
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

    const getFollowers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/followersCount/${currentUser['_id']}`);
            setFollowers(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const getFollowees = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/followeesCount/${currentUser['_id']}`);
            setFollowees(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        getFollowers();
        getFollowees();
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

    const AccordionStyle = {
        backgroundColor: '#f1f7fa',
        borderRadius: '20px !important',
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100% !important',
            gap: '15px', marginTop: '10px'}}>
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="center">
                    <Grid item xs={4}>
                        <Profile {...currentUser} />
                    </Grid>
                    <Grid container xs={8} direction="row" alignItems="center">
                        <Grid item xs={3}>
                            <Button sx={{backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal"
                                    onClick={ () => { setFolloweesOpen(true) }}
                                    startIcon={<PeopleIcon sx={{color: blue[700]}}/>}>
                                <Typography>Followees: {followees}</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button sx={{backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal"
                                    onClick={ () => { setFollowersOpen(true) }}
                                    startIcon={<PeopleIcon sx={{color: blue[700]}}/>}>
                                <Typography>Followers: {followers}</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button sx={{backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={goDashboard}
                                    startIcon={<LeaderboardTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Dashboard</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button sx={{backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal" onClick={goSettings}
                                    startIcon={<SettingsTwoToneIcon sx={{color: blue[700]}}/>}>
                                <Typography>Settings</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <CurrentlyReading user={currentUser['_id']}/>

            <Grid container textAlign="center" direction="row" alignItems="flex-start" justifyContent="space-betwwen"
                spacing={1}>
                <Grid container item xs={3.5} direction="column" alignItems="center" justifyContent="center" spacing={1}>
                    <Grid item xs={12} sx={{width: '100%'}}>
                        <CompetitionProfBlock user={currentUser['_id']}/>
                    </Grid>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center" justifyContent="center">
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

                <Grid container item xs={3.5} direction="column" alignItems="center" justifyContent="center" spacing={1}>
                    <Grid item sx={{width: '100%'}}>
                        <Accordion sx={AccordionStyle}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="wishlist-content"
                                id="wishlist-header"
                                onClick={ () => { fetchWishlist() } }
                            >
                                <BookmarkTwoToneIcon sx={{ color: blue[700], height: '30px'}}/>
                                <Typography variant="h5" sx={{ width: '100%' }}>Wishlist</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: '2%', marginTop: '-15px' }}>
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
                                                                  <IconButton sx={{color: blue[500], position: 'absolute',
                                                                      right: '-10px', top: '-20px',
                                                                      '&:hover': {color: red[500]}}}
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
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item sx={{width: '100%'}}>
                        <Accordion sx={AccordionStyle}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="recently-read-content"
                                id="recently-read-header"
                                onClick={ () => {  } }
                            >
                                <MenuBookTwoToneIcon sx={{ color: blue[700], height: '30px'}}/>
                                <Typography variant="h5" sx={{ width: '100%' }}>Recently read books</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: '2%', marginTop: '-15px' }}>
                                <RecentlyReadBooks user={currentUser['_id']}/>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item sx={{width: '100%'}}>
                        <Accordion sx={AccordionStyle}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="favorites-content"
                                id="favorites-header"
                                >
                                <FavoriteTwoTone sx={{ color: blue[700], height: '30px'}}/>
                                <Typography variant="h5" sx={{ width: '100%' }}>Favorites</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: '2%', marginTop: '-15px' }}>
                                <FavoriteBookList user={currentUser['_id']}/>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={wishlistOpen} fullWidth={true}>
                <DialogTitle><Typography variant="h5" textAlign="center">Your wishlist</Typography></DialogTitle>
                <ClearIcon onClick={() => setWishlistOpen(false)} sx={{position: 'absolute', right: '10px', top: '10px',
                    color: 'grey', cursor: 'pointer'}}/>
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
            </Dialog>

            <Dialog open={followersOpen} fullWidth={true}>
                <ClearIcon onClick={() => setFollowersOpen(false)} sx={{position: 'absolute',
                    right: '10px', top: '10px', color: 'grey', cursor: 'pointer'}}/>
                <DialogContent>
                    <FollowingList user={currentUser['_id']} followers_or_followees={"followers"}/>
                </DialogContent>
            </Dialog>

            <Dialog open={followeesOpen} fullWidth={true}>
                <ClearIcon onClick={() => setFolloweesOpen(false)} sx={{position: 'absolute',
                    right: '10px', top: '10px', color: 'grey', cursor: 'pointer'}}/>
                <DialogContent>
                    <FollowingList user={currentUser['_id']} followers_or_followees={"followees"}/>
                </DialogContent>
            </Dialog>

            <Dialog open={recentlyReadOpen} fullWidth={true}>
                <ClearIcon onClick={() => setRecentlyReadOpen(false)} sx={{position: 'absolute',
                    right: '10px', top: '10px', color: 'grey', cursor: 'pointer'}}/>
                <DialogContent>
                    <RecentlyReadBooks user={currentUser['_id']}/>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default ProfilePage;
