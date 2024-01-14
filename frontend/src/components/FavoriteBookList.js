import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Divider, List, ListItem, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemoveTwoTone';
import {blue, red} from "@mui/material/colors";
import {Navigate} from "react-router-dom";

let currentUser = localStorage.getItem('logged_user');
if (!currentUser) {
    console.log('La chiave "logged_user" non è presente in localStorage.');
    // Redirect to login
    <Navigate to="/login" />;
}

function FavoriteBookList({user}) {
    currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [books, setBooks] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);

    console.log("Username: " + currentUser["_id"]);
    console.log("User: " + user);

    const style = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/favoriteBooks?username=${user}`);
            console.log("Received: " + response.data);

            setBooks(JSON.parse(`[${response.data}]`).map(book => book.replace(/"/g, '')));

            currentUser['favoriteBooks'] = JSON.parse(`[${response.data}]`).map(book => book.replace(/"/g, ''));
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

    async function removeFavorite(book) {
        // Removea book from favorite list in database
        await axios.delete(`/api/removeFavoriteBook/${currentUser["_id"]}/${book}`);
        setBooks(books.filter(item => item !== book));

        // Remove book from favorite list in local storage
        currentUser['favoriteBooks'].splice(currentUser["favoriteBooks"].indexOf(book), 1);
    }

    return (
        <Container>
            <List sx={style}>
                {books.length === 0 ? (
                    <ListItem>
                        <Typography>No books to show</Typography>
                    </ListItem>
                ) : (
                    Array.isArray(books) && books.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                {book}
                                {/* Allow to remove favorite books only on personal profile */}
                                {currentUser["_id"] === user && (
                                    <Tooltip title="Remove from favorites">
                                        <IconButton sx={{color: blue[500], '&:hover': {color: red[500]}}} onClick={() => removeFavorite(book)}>
                                            <BookmarkRemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItem>
                            <Divider variant="middle" component="li" />
                        </React.Fragment>
                    ))
                )}
            </List>
            {books.length > displayCount && (
                <Button variant="filledTonal" onClick={loadAllBooks}><Typography>Show all</Typography></Button>
            )}
        </Container>
    );
}

export default FavoriteBookList;
