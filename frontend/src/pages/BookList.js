import React, {useState, useEffect} from 'react';
import axios from 'axios';

function BookList() {
    const [books, setBooks] = useState([]);
    const [showBooks, setShowBooks] = useState(false);

    const fetchBooks = async (e) => {
/*
    e.preventDefault();
    try{
        const response = await axios.get('http://localhost:8080/api/books2');
        setBooks(response.data);
        setShowBooks(true);
        console.log(response.data)
    }
    catch (error)
    {
        console.log(error.response)
    }
*/

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
        <div>
            <button onClick={fetchBooks}>Carica 10 libri</button>
            {showBooks && Array.isArray(books) && books.map((book, index) => (
                <p key={index}>{book.title}</p>
            ))}
        </div>
    );
}

export default BookList;