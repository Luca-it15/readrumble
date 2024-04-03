import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import FavoriteBookList from '../components/FavoriteBookList';
import FollowingList from '../components/FollowingList';
import {
    Container,
    Grid,
    Typography,
    Paper,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    Link,
    Divider,
    Dialog,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
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
import PeopleIcon from "@mui/icons-material/PeopleAltTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import {FavoriteTwoTone} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

function OtherUserProfile() {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const {username} = useParams();
    const [isFollowing, setIsFollowing] = useState(currentUser['following'].includes(username));
    const [userInfo, setUserInfo] = useState([]);
    const [books, setBooks] = useState([]);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followeesOpen, setFolloweesOpen] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [followees, setFollowees] = useState(0);

    const navigate = useNavigate();

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

    const getFollowers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/followersCount/${username}`);
            setFollowers(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const getFollowees = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/followeesCount/${username}`);
            setFollowees(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchUserInformation();
        getFollowees();
        getFollowers();
    }, [username]);

    const AccordionStyle = {
        backgroundColor: '#f1f7fa',
        borderRadius: '20px !important',
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100% !important',
            gap: '15px', marginTop: '10px'}}>
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={0.5}>
                        <GoBack/>
                    </Grid>
                    <Grid item xs={4}>
                        <Profile {...userInfo} />
                    </Grid>
                    <Grid container xs={7.5} direction="row" alignItems="center" justifyContent="space-evenly">
                        <Grid item xs={3}>
                            <Button sx={{backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal"
                                    onClick={ () => { getFollowees(); setFolloweesOpen(true) }}
                                    startIcon={<PeopleIcon sx={{color: blue[700]}}/>}>
                                <Typography>Followees: {followees}</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button sx={{backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                                    variant="filledTonal"
                                    onClick={ () => { getFollowers(); setFollowersOpen(true) }}
                                    startIcon={<PeopleIcon sx={{color: blue[700]}}/>}>
                                <Typography>Followers: {followers}</Typography>
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

            <Grid container textAlign="center" spacing={1} direction="row" alignItems="flex-start"
                  justifyContent="space-betwwen">
                <Grid item xs={3.5}>
                    <CompetitionProfBlock user={username}/>
                </Grid>

                <Grid item xs={5}>
                    <Paper elevation={2} style={PaperStyle}>
                        <Typography variant="h5">Posts</Typography>
                        <PostsList user={true} username={username} size={12} all={false} path={1}/>
                    </Paper>
                </Grid>

                <Grid container item xs={3.5} direction="column" alignItems="center" justifyContent="center" spacing={1}>
                    <Grid item sx={{width: '100%'}}>
                        <Accordion sx={AccordionStyle} onChange={(event, isExpanded) => {
                            if (isExpanded)
                                fetchWishlist();
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="wishlist-content"
                                id="wishlist-header"
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
                                                <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
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
                            >
                                <MenuBookTwoToneIcon sx={{ color: blue[700], height: '30px'}}/>
                                <Typography variant="h5" sx={{ width: '100%' }}>Recently read books</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: '2%', marginTop: '-15px' }}>
                                <RecentlyReadBooks user={username}/>
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
                                <FavoriteBookList user={username}/>
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
                                    <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
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
                    <FollowingList user={username} followers_or_followees={"followers"}/>
                </DialogContent>
            </Dialog>

            <Dialog open={followeesOpen} fullWidth={true}>
                <ClearIcon onClick={() => setFolloweesOpen(false)} sx={{position: 'absolute',
                    right: '10px', top: '10px', color: 'grey', cursor: 'pointer'}}/>
                <DialogContent>
                    <FollowingList user={username} followers_or_followees={"followees"}/>
                </DialogContent>
            </Dialog>

        </Container>
    );
}

export default OtherUserProfile;
