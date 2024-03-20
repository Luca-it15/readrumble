import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PersonRemoveTwoToneIcon from "@mui/icons-material/PersonRemoveTwoTone";
import {blue, red} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";

function FollowingList({user, followers_or_followees}) {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

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

    async function fetchFollwers() {
        if (user === currentUser['_id'] && currentUser['followers'] && currentUser['followers'].length > 0) {
            setFollowers(currentUser['followers'])
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/followers/${user}`);
            setFollowers(response.data);
        } catch (error) {
            console.log(error.response)
        }
    }

    // Works only if "user" is current user, because only on the personal profile we can unfollow users in the following list
    async function unfollow(username) {
        try {
            await axios.delete(`http://localhost:8080/api/unfollow/${currentUser['_id']}/${username}`);

            // Remove user from following list
            let updatedFollowing = currentUser['following'].filter(followingUser => followingUser !== username);
            currentUser['following'] = updatedFollowing;
            localStorage.setItem('logged_user', JSON.stringify(currentUser));
            setFollowing(updatedFollowing);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchFollowing();
        fetchFollwers();
    }, [user]);

    function seeProfile(username) {
        if (username === currentUser['_id']) {
            navigate('/profile')
        } else {
            navigate(`/user/${username}`)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            { followers_or_followees === "followees" ? (
                <>
                    <Typography variant="h5" sx={{marginBottom: '5px'}}>
                        {user === currentUser['_id'] ? "Users you follow" : user + " is following"}
                    </Typography>
                    <List sx={ListStyle}>
                        {following.length === 0 ? (
                            <ListItem>
                                <Typography>Not following anybody</Typography>
                            </ListItem>
                        ) : (
                            following.map((username, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa", borderRadius: '30px'}}}
                                              secondaryAction={user === currentUser['_id'] && (
                                                  <Tooltip title="Unfollow">
                                                      <IconButton sx={{color: blue[500], '&:hover': {color: red[500]}}}
                                                                  onClick={() => unfollow(username)}>
                                                          <PersonRemoveTwoToneIcon/>
                                                      </IconButton>
                                                  </Tooltip>
                                              )}>
                                        <Link onClick={() => { seeProfile(username) }}
                                              sx={{color: "#000000", '&:hover': {cursor: 'pointer'}}}>
                                            <Typography>{username}</Typography>
                                        </Link>
                                    </ListItem>
                                    <Divider variant="middle" component="li"/>
                                </React.Fragment>
                            )))}
                    </List>
                </>
            ) : (
                <>
                    <Typography variant="h5" sx={{marginBottom: '5px'}}>
                        {user === currentUser['_id'] ? "Your followers" : user + "'s followers"}
                    </Typography>
                    <List sx={ListStyle}>
                        {followers.length === 0 ? (
                            <ListItem>
                                <Typography>No followers yet</Typography>
                            </ListItem>
                        ) : (
                            followers.map((username, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <Link onClick={() => { seeProfile(username) }}
                                              sx={{color: "#000000", '&:hover': {cursor: 'pointer'}}}>
                                            <Typography>{username}</Typography>
                                        </Link>
                                    </ListItem>
                                    <Divider variant="middle" component="li"/>
                                </React.Fragment>
                            )))}
                    </List>
                </>
            )}
        </Box>
    );
}

export default FollowingList;
