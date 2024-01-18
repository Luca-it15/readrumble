import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import PostRow from './PostRow'; // Assicurati che il percorso sia corretto

const PostsListAll = () => {
  const [posts, setposts] = useState([]);
 
  useEffect(() => {
    // Sostituisci 'http://localhost:8080/posts' con l'URL del tuo server
    axios.get(`http://localhost:8080/api/post/all`)
      .then(response => {
        setposts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

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
         user={true}
         all={true}
       />
     ))}
    
    </div>
  );
};

export default PostsListAll;
