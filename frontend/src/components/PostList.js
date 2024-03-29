import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Grid, Typography} from '@mui/material';
import Button from '@mui/material-next/Button';

import PostRow from './PostRow';
import '../App.css';
import CircularProgress from "@mui/material/CircularProgress";
import {blue, red} from "@mui/material/colors";

const PostsList = (user) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [displayCount , setDisplayCount] = useState(10);

    let currentUser = localStorage.getItem('logged_user');

    let isAdmin = localStorage.getItem('isAdmin') || false;


    if (currentUser) {
        currentUser = JSON.parse(currentUser);
    } else {
        console.log('logged_user key is not present in the localstorage');
    }

    let user_or_book = '';

    user.user ? (user_or_book = user.username) : (user_or_book = user.book_id);

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
            axios.get(`http://localhost:8080/api/post/all/${user_or_book}/${user.user}`)
                .then(response => {
                    let postLocalStorageJson = localStorage.getItem('last_posts');

                    if ((user.username === currentUser['_id']) && (postLocalStorageJson != null)) {
                        let posts = JSON.parse(postLocalStorageJson);

                        //remove the posts make 15 minutes ago o more
                        let now = new Date();

                        posts = posts.filter(post => {
                            let postDate = new Date(post.date_added);

                            let differenceInMinutes = (now - postDate) / 1000 / 60;

                            return differenceInMinutes <= 20;
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
            axios.get(`http://localhost:8080/api/search/posts/${user_or_book}/${isAdmin}`)
                .then(response => {
                    setPosts(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }

    }, [user.username]);

    function loadMorePosts() {
        axios.get(`http://localhost:8080/api/post/morePosts/${user_or_book}/${user.user}`)
            .then(response => {
                setPosts([...posts, ...response.data]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <>
        <Grid container direction="row" justifyContent="center" alignItems="center" sx={{gap: '10px'}}>
            {!isLoading ? (
                posts.length > 0 ? (
                    posts.slice(0, displayCount).map((post, index) => (
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
        <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ width: '100%', marginTop: '20px' }}/>
            {(displayCount === 10 && !user.user) && (
                <Grid item>
                    <Button
                        onClick={() => {
                            loadMorePosts();
                            setDisplayCount(displayCount + 10)
                        }}
                        sx={{color: 'black', backgroundColor: blue[100], '&:hover': {backgroundColor: blue[100]}}}
                    >
                        <Typography>
                            Load more
                        </Typography>
                    </Button>
                </Grid>
            )}
            {(displayCount === 20 && !user.user) && (
                <Grid item>
                    <Button
                        onClick={() => {
                            setDisplayCount(10)
                            setPosts(posts.slice(0, 10))
                        }}
                        sx={{color: 'black', backgroundColor: red[100], '&:hover': {backgroundColor: red[100]}}}
                    >
                        <Typography>
                            Load less
                        </Typography>
                    </Button>
                </Grid>
            )}
        </>
    );
};

export default PostsList;
