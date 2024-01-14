import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {Divider, List, ListItem, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PersonRemoveTwoToneIcon from "@mui/icons-material/PersonRemoveTwoTone";
import {blue, red} from "@mui/material/colors";

// !!! UNTESTED !!!

let currentUser = JSON.parse(localStorage.getItem('logged_user'));

function FollowingList({user}) {
    // Check se following è vuoto
    if (currentUser['following'] === undefined) {
        currentUser['following'] = [];
    }

    // if user is current user, then show currentUser['following'], otherwise will fetch the user's following list
    var initialFollowing = (user === currentUser['_id']) ? currentUser['following'] : [];
    var [following, setFollowing] = useState(initialFollowing);

    const [displayCount, setDisplayCount] = useState(10);

    const style = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    // Works in both cases: if "user" is current user or another user, because we are on their profile, and have to show their following list
    async function fetchFollowing({user}) {
        try {
            const response = await axios.get(`http://localhost:8080/api/following?username=${user}`);
            setFollowing(JSON.parse(response.data));
            console.log("Received: " + response.data)
        } catch (error) {
            console.log(error.response)
        }
    }

    // Works only if "user" is current user, because only on the personal profile we can unfollow users in the following list
    async function unfollow(user) {
        try {
            await axios.delete(`/api/unfollow/${currentUser['_id']}/${user}`);

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
        fetchFollowing(user);
    }, []);

    const loadAllFollowings = () => {
        setDisplayCount(following.length);
    };

    return (
        <Container>
            <List sx={style}>
                {following.length === 0 ? (
                    <ListItem>
                        <Typography>This list is empty</Typography>
                    </ListItem>
                ) : (
                    following.slice(0, displayCount).map((username, index) => (
                        <React.Fragment key={index}>
                            <ListItem key={index}>
                                {username}

                                {/* Show the button to unfollow users only on personal profile */}
                                {user === currentUser['_id'] && (
                                    <Tooltip title="Unfollow">
                                        <IconButton sx={{color: blue[500], '&:hover': {color: red[500]}}}
                                                    onClick={() => unfollow(username)}>
                                            <PersonRemoveTwoToneIcon/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItem>
                            <Divider variant="middle" component="li"/>
                        </React.Fragment>
                    )))}
            </List>
            {following.length > displayCount && (
                <Button variant="contained" onClick={loadAllFollowings}>Show all</Button>
            )}
        </Container>
    );
}

export default FollowingList;
