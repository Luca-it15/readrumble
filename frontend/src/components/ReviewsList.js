import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import ReviewRow from './ReviewRow'; // Assicurati che il percorso sia corretto

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
   
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
    // Sostituisci 'http://localhost:8080/reviews' con l'URL del tuo server
    axios.get(`http://localhost:8080/api/review/all/${username}`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [username]);

  return (
    <div>
      {reviews.map((review, index) => (
        <ReviewRow 
          key={index}
          title={review.title}
          username={review.username}
          pagesRead={review.numberOfPagesRead}
          review={review.review}
          rating={review.rating}
          readOnly={true}
          date={review.date}
        />
      ))}
    
    </div>
  );
};

export default ReviewsList;
