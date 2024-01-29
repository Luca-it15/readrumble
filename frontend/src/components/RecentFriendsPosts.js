import React, {useEffect, useState} from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import {Grid, Typography} from '@mui/material';

import PostRow from './PostRow'; // Assicurati che il percorso sia corretto
import '../App.css';
import {blue} from "@mui/material/colors";

const RecentFriendsPosts = () => {
    const [posts, setPosts] = useState([]);

    let currentUser = localStorage.getItem('logged_user');
    // Verifica se il valore è presente
    if (currentUser) {
        // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
        currentUser = JSON.parse(currentUser);
    } else {
        // La chiave 'isLoggedIn' non è presente in localStorage
        console.log('La chiave "logged_user" non è presente in localStorage.');
    }
    let user = currentUser['_id'];
    let friends = currentUser['following'];


    const recentFriendsPosts = async () => {
        if (friends != null && friends.length != 0) {
            try {
                const response = await axios.post('http://localhost:8080/api/post/friends', friends);

                setPosts(response.data);

                console.log(response.data);

            } catch (error) {
                console.log("error in retrieving your friends' posts")
            }
        }

    }

    useEffect(() => {
        recentFriendsPosts();
    }, [user]);

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center">
            {(posts != null && posts.length > 0) ? (posts.map((post, index) => (
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
                <Typography variant='h4'>No friends added</Typography>
            )}
        </Grid>
    );
};

export default RecentFriendsPosts;
