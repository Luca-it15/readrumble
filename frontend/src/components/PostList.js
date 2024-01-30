import React, {useEffect, useState} from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import {Grid, Typography} from '@mui/material';

import PostRow from './PostRow'; // Assicurati che il percorso sia corretto
import '../App.css';
import {blue} from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";

const PostsList = (user, username, book_id, size, all, path) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let parameter2 = user.user;

    let parameter1 = '';

    parameter2 ? (parameter1 = user.username) : (parameter1 = user.book_id);

    useEffect(() => {
        setIsLoading(true);

        if (user.path === 0) {
            //all post
            axios.get(`http://localhost:8080/api/post/all`)
                .then(response => {
                    setPosts(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });

        } else if (user.path === 1) {
            //user post
            axios.get(`http://localhost:8080/api/post/all/${parameter1}/${parameter2}`)
                .then(response => {
                    let postLocalStorageJson = localStorage.getItem('last_posts');

                    if (postLocalStorageJson != null) {
                        let posts = JSON.parse(postLocalStorageJson);

                        //remove the posts make 15 minutes ago o more
                        let now = new Date();

                        posts = posts.filter(post => {
                            let postDate = new Date(post.date_added);

                            let differenceInMinutes = (now - postDate) / 1000 / 60;

                            return differenceInMinutes <= 15;
                        });

                        localStorage.setItem('posts', JSON.stringify(posts));

                        let postLocalStorage = posts;

                        let postMongoDB = response.data;

                        let totalPost = [...postLocalStorage, ...postMongoDB];

                        setPosts(totalPost);
                        setIsLoading(false);
                    } else
                        setPosts(response.data);
                        setIsLoading(false);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            //search post
            axios.get(`http://localhost:8080/api/search/posts/${parameter1}`)
                .then(response => {
                    setPosts(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }

    }, [user.username]);

    return (
        <Grid container direction="row" justifyContent="center" alignItems="flex-start" sx={{gap: '10px'}}>
            {!isLoading ? (
                posts.length > 0 ? (
                    posts.map((post, index) => (
                        <Grid container item direction="coloumn" xs={user.size}
                              sx={{borderRadius: 6, textAlign: 'center'}}>
                            <PostRow
                                key={index}
                                id={post._id}
                                book_id={post.book_id}
                                title={post.book_title}
                                username={post.username}
                                post={post.post}
                                rating={post.rating}
                                text={post.review_text}
                                readOnly={true}
                                date={post.date_added}
                                user={user}
                                all={user.all}
                            />
                        </Grid>
                    ))
                ) : (
                    !isLoading && <Typography variant='h6'>No posts found</Typography>
                )
            ) : (
                <CircularProgress size={50} sx={{marginY: '90px'}}/>
            )}
        </Grid>
    );
};

export default PostsList;
