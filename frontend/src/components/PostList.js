import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import { Grid } from '@mui/material';

import PostRow from './PostRow'; // Assicurati che il percorso sia corretto
import '../App.css'; 

const PostsList = (user, username, book_id, size, all) => {
  const [posts, setposts] = useState([]);
  
  
  console.log(user); 
  let parametro2 = user.user;  
 
  let parametro1 = ''; 
    
    parametro2 ? (parametro1 = user.username) : (parametro1 = user.book_id); 
  console.log(parametro2); 
  console.log(parametro1); 
  useEffect(() => {
    
    if(user.all) {
      axios.get(`http://localhost:8080/api/post/all`)
      .then(response => {
        setposts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    } else {
    // Sostituisci 'http://localhost:8080/posts' con l'URL del tuo server
    axios.get(`http://localhost:8080/api/post/all/${parametro1}/${parametro2}`)
      .then(response => {
        setposts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    }
  },[]);


  return (
    <Grid container direction="row" justifyContent="center" alignItems="center"
    sx={12}>
      {posts.map((post, index) => (
       <React.Fragment key={index}>
       <Grid  direction="coloumn" xs={user.size} sx={{borderRadius: '15px', textAlign: 'center', border: '3pt solid #1976d2', margin: '0.5%'}}>
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
