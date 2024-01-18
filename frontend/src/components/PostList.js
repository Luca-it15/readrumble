import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import PostRow from './PostRow'; // Assicurati che il percorso sia corretto

const PostsList = (user, username, book_id) => {
  const [posts, setposts] = useState([]);
  
  
  console.log(user); 
  let parametro2 = JSON.stringify(user.user);  
 
  let parametro1 = ''; 
    if(parametro2) {
      console.log("invio per user" + user.username); 
       parametro1 = user.username; 
    }
    else {
      parametro1 = JSON.stringify(user.book_id);
      console.log(parametro1);  
    }
  console.log(parametro2); 
  console.log(parametro1); 
  useEffect(() => {
   
    // Sostituisci 'http://localhost:8080/posts' con l'URL del tuo server
    axios.get(`http://localhost:8080/api/post/all/${parametro1}/${parametro2}`)
      .then(response => {
        setposts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  },[]);


  return (
    <div>
      {posts.map((post, index) => (
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
        />
      ))}
    
    </div>
  );
};

export default PostsList;
