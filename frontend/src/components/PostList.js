import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import PostRow from './PostRow'; // Assicurati che il percorso sia corretto

const PostsList = () => {
  const [posts, setposts] = useState([]);
   
  var storedData = localStorage.getItem('logged_user');


  if (storedData) {
      // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
      var user = JSON.parse(storedData);
  
      // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
      console.log(user["Username"]);
  } else {
      // La chiave 'isLoggedIn' non è presente in localStorage
      console.log('La chiave "logged_user" non è presente in localStorage.');
  }
  let username = user["Username"]; 
  useEffect(() => {
    // Sostituisci 'http://localhost:8080/posts' con l'URL del tuo server
    axios.get(`http://localhost:8080/api/post/all/${username}`)
      .then(response => {
        setposts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [username]);

  return (
    <div>
      {posts.map((post, index) => (
        <PostRow 
          key={index}
          title={post.title}
          username={post.username}
          pagesRead={post.numberOfPagesRead}
          post={post.post}
          rating={post.rating}
          readOnly={true}
          date={post.date}
        />
      ))}
    
    </div>
  );
};

export default PostsList;
