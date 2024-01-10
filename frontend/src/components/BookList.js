import React, {useState} from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function BookList() {
    const [books, setBooks] = useState([]);
    const [showBooks, setShowBooks] = useState(false);

    const fetchBooks = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/api/10books');
            setBooks(response.data);
            setShowBooks(true);
            console.log("Ricevuto: " + response.data)
        } catch (error) {
            console.log(error.response)
        }
    };

    return (
        <Container>
            <Button variant="contained" color="primary" onClick={fetchBooks}>
                Carica 10 libri
            </Button>
            {showBooks && Array.isArray(books) && books.map((book, index) => (
                <Typography key={index} variant="h6">
                    {book.title}
                </Typography>
            ))}
        </Container>
    );
}

export default BookList;
