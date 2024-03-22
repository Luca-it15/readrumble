import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Grid, Typography} from '@mui/material';

import PostRow from './PostRow';
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';

const RecentFriendsPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    let user = currentUser['_id'];
    let friends = currentUser['following'];

    const recentFriendsPosts = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/post/friends/${currentUser['_id']}`);

            if (response.data === null) {
                setPosts([]);
                setIsLoading(false);
                return;
            }

            setPosts(response.data);

            setIsLoading(false);
        } catch (error) {
            console.log("error in retrieving your friends' posts")
        }
    }

    useEffect(() => {
        recentFriendsPosts();
    }, [user]);

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center">
            {(!isLoading) ? (posts.map((post, index) => (
                <Grid item xs={12} sx={{
                    width: '100%', marginY: '5px', borderRadius: 5,
                    boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.2)', '&:hover': {boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.2)'}
                }}>
                    <PostRow
                        key={index}
                        id={post._id}
                        book_id={post.book_id}
                        title={post.book_title}
                        username={post.username}
                        text={post.text}
                        post={post.post}
                        rating={post.rating}
                        readOnly={true}
                        date={post.date_added}
                        user={user}
                        all={true}
                    />
                </Grid>
            ))) : (
                friends != null && friends.length !== 0 ? (
                    <CircularProgress size={50} sx={{marginY: '90px'}}/>
                ) : (
                    <Typography variant='h6'>Posts by the users you follow will be displayed here</Typography>
                )
            )}
        </Grid>
    );
};

export default RecentFriendsPosts;
