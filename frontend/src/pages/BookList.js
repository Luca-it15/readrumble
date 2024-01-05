import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookList() {
    const [books, setBooks] = useState([]);
    const [showBooks, setShowBooks] = useState(false);

    const fetchBooks = async () => {
        const response = await axios.get('/api/books');
        setBooks(response.data);
        setShowBooks(true);
    };

    return (
        <div>
            <button onClick={fetchBooks}>Carica libri</button>
            {showBooks && books.map((book, index) => (
                <p key={index}>{book.title}</p>
            ))}
        </div>
    );
}

export default BookList;