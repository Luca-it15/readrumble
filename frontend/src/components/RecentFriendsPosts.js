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

    console.log(friends); 
     
    console.log(friends.length); 
   

    const recentFriendsPosts = async() => {
        if(friends.length != 0) {
            try {
                // Invia i dati al server usando Axios
                const response = await axios.post('http://localhost:8080/api/post/friends', friends);
                
               setPosts(response.data); 
               
            } catch (error) {
               console.log("error in retrieving your friends' posts")
            }
         } 
         
    }
    
    useEffect(() => {
       recentFriendsPosts(); 
    }, [user]);

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center"
              sx={12}>
            {(posts.length > 0) ? (posts.map((post, index) => (
                <React.Fragment key={index}>
                    <Grid direction="coloumn" xs={12}
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
                            all={true}
                        />
                    </Grid>
                </React.Fragment>
            ))):(<Typography variant='h4'>Nessun amico aggiunto</Typography>)}
        </Grid>
    );
};

export default RecentFriendsPosts;
