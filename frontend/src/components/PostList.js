import React, {useEffect, useState} from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import {Grid} from '@mui/material';

import PostRow from './PostRow'; // Assicurati che il percorso sia corretto
import '../App.css';
import {blue} from "@mui/material/colors";

const PostsList = (user, username, book_id, size, all) => {
    const [posts, setPosts] = useState([]);

    console.log(user);
    let parameter2 = user.user;

    let parameter1 = '';

    parameter2 ? (parameter1 = user.username) : (parameter1 = user.book_id);
    console.log(parameter2);
    console.log(parameter1);
    useEffect(() => {

        if (user.all) {
            axios.get(`http://localhost:8080/api/post/all`)
                .then(response => {
                    setPosts(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            axios.get(`http://localhost:8080/api/post/all/${parameter1}/${parameter2}`)
                .then(response => {
                    setPosts(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }, []);

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center"
              sx={12}>
            {posts.map((post, index) => (
                <React.Fragment key={index}>
                    <Grid direction="coloumn" xs={3}
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
            ))}
        </Grid>
    );
};

export default PostsList;
