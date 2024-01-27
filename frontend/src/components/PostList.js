import React, {useEffect, useState} from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import {Grid, Typography} from '@mui/material';

import PostRow from './PostRow'; // Assicurati che il percorso sia corretto
import '../App.css';
import {blue} from "@mui/material/colors";

const PostsList = (user, username, book_id, size, all, path) => {
    const [posts, setPosts] = useState([]);

    console.log(user);
    let parameter2 = user.user;

    let parameter1 = '';

    parameter2 ? (parameter1 = user.username) : (parameter1 = user.book_id);
    console.log(parameter2);
    console.log(parameter1);
    console.log("il path scelto e' " + user.path); 
    useEffect(() => {

        if (user.path === 0) {
            //all post
            axios.get(`http://localhost:8080/api/post/all`)
                .then(response => {
                    setPosts(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else if(user.path === 1){

            //user post
            axios.get(`http://localhost:8080/api/post/all/${parameter1}/${parameter2}`)
                .then(response => {

                
                let postLocalStorageJson = localStorage.getItem('last_posts');
                if(postLocalStorageJson != null) {
                 
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
                 }
                 else 
                  setPosts(response.data); 
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            //search post
            axios.get(`http://localhost:8080/api/search/posts/${parameter1}`)
                .then(response => {
                    setPosts(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, [user.username]);

    return (
        <Grid item container direction="row" justifyContent="center" alignItems="center"
              sx={12}>
            {(posts.length > 0) ? (posts.map((post, index) => (
                <React.Fragment key={index}>
                    <Grid direction="coloumn" xs={user.size} item
                          sx={{borderRadius: 6, textAlign: 'center', border: '2pt solid ' + blue[400], margin: '0.5%'}}>
                        <PostRow
                            key={index}
                            id={post._id}
                            title={post.book_title}
                            username={post.username}
                            post={post.post}
                            rating={post.rating}
                            readOnly={true}
                            date={post.date_added}
                            user={user}
                            all={user.all}
                        />
                    </Grid>
                </React.Fragment>
            ))):(<Typography variant='h4'>Nessun Post trovato</Typography>)}
        </Grid>
    );
};

export default PostsList;
