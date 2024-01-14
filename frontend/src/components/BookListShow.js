import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card'; 
import { CardContent } from '@mui/material';

function BookListShow() {
    const [books, setBooks] = useState([]);
    useEffect(() => {
        // Sostituisci 'http://localhost:8080/reviews' con l'URL del tuo server
        axios.get(`http://localhost:8080/api/10books`)
          .then(response => {
            setBooks(response.data);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);

    return (
        <Container>
           <div>
            {books.map((book, index) => (
                 <Card variant="outlined">
                 <CardContent>
                  <Typography variant="h5" component="div">
                     Titolo del libro: {book.title}
                   </Typography>
                 </CardContent>
                </Card> 
            ))}
         </div> 
        </Container>
    );

}

export default BookListShow;
