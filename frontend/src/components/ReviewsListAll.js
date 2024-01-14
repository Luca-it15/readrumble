import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assicurati di aver installato axios con npm install axios
import ReviewRow from './ReviewRow'; // Assicurati che il percorso sia corretto

const ReviewsListAll = () => {
  const [reviews, setReviews] = useState([]);
 
  useEffect(() => {
    // Sostituisci 'http://localhost:8080/reviews' con l'URL del tuo server
    axios.get(`http://localhost:8080/api/review/all`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

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

export default ReviewsListAll;
