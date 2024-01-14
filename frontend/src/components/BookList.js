import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function BookList() {
    const [books, setBooks] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);

    const storedData = localStorage.getItem('logged_user');
    const user = JSON.parse(storedData);
    console.log("Username: " + user["_id"]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/favoriteBooks?username=${user["_id"]}`);
            setBooks(JSON.parse(`[${response.data}]`).map(book => book.replace(/"/g, '')));
            console.log("Received: " + response.data)
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const loadAllBooks = () => {
        setDisplayCount(books.length);
    };

    return (
        <Container>
            {Array.isArray(books) && books.slice(0, displayCount).map((book, index) => (
                <Typography key={index}>
                    {book}
                </Typography>
            ))}
            {books.length > displayCount && (
                <Button variant="contained" onClick={loadAllBooks}>Show all</Button>
            )}
        </Container>
    );
}

export default BookList;
