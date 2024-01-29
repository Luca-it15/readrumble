import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PersonRemoveTwoToneIcon from "@mui/icons-material/PersonRemoveTwoTone";
import {blue, red} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";

function FollowingList({user}) {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [following, setFollowing] = useState([]);
    const [displayCount, setDisplayCount] = useState(6);

    const navigate = useNavigate();

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 5,
        width: '100%'
    }

    // Works in both cases: if "user" is current user or another user, because we are on their profile, and have to show their following list
    async function fetchFollowing() {
        if (user === currentUser['_id'] && currentUser['following'] && currentUser['following'].length > 0) {
            setFollowing(currentUser['following'])
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/following/${user}`);
            setFollowing(response.data);
        } catch (error) {
            console.log(error.response)
        }
    }

    // Works only if "user" is current user, because only on the personal profile we can unfollow users in the following list
    async function unfollow() {
        try {
            await axios.delete(`http://localhost:8080/api/unfollow/${currentUser['_id']}/${user}`);

            // Remove user from following list
            let updatedFollowing = currentUser['following'].filter(followingUser => followingUser !== user);
            currentUser['following'] = updatedFollowing;
            localStorage.setItem('logged_user', JSON.stringify(currentUser));
            setFollowing(updatedFollowing);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user === currentUser['_id']) {
            // If user is current user, then show currentUser['following']
            setFollowing(currentUser['following']);
        } else {
            fetchFollowing();
        }
    }, [user]);

    const loadAllFollowings = () => {
        setDisplayCount(following.length);
    };

    function seeProfile(username) {
        if (username === currentUser['_id']) {
            navigate('/profile')
        } else {
            navigate(`/user/${username}`)
        }
    }

    function loadLessFollowings() {
        setDisplayCount(6);
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5" sx={{marginBottom: '5px'}}>
                {user === currentUser['_id'] ? "Users you follow" : user + " is following"}
            </Typography>
            <List sx={ListStyle}>
                {following.length === 0 ? (
                    <ListItem>
                        <Typography>No users following</Typography>
                    </ListItem>
                ) : (
                    following.slice(0, displayCount).map((username, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}
                                      secondaryAction={user === currentUser['_id'] && (
                                          <Tooltip title="Unfollow">
                                              <IconButton sx={{color: blue[500], '&:hover': {color: red[500]}}}
                                                          onClick={() => unfollow()}>
                                                  <PersonRemoveTwoToneIcon/>
                                              </IconButton>
                                          </Tooltip>
                                      )}>
                                <Link onClick={() => {
                                    seeProfile(username)
                                }} sx={{color: "#000000", '&:hover': {cursor: 'pointer'}}}>
                                    <Typography>{username}</Typography>
                                </Link>
                            </ListItem>
                            <Divider variant="middle" component="li"/>
                        </React.Fragment>
                    )))}
            </List>
            {following.length > displayCount ? (
                <Button sx={{
                    backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}
                }}
                        variant="filledTonal" onClick={loadAllFollowings}>
                    <Typography>Show all</Typography>
                </Button>
            ) : (
                <Button sx={{
                    backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}
                }}
                        variant="filledTonal" onClick={loadLessFollowings}>
                    <Typography>Show less</Typography>
                </Button>
            )}
        </Paper>
    );
}

export default FollowingList;
