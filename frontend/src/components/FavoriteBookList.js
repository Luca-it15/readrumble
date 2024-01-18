import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemoveTwoTone';
import {blue, red} from "@mui/material/colors";
import {Navigate, useNavigate} from "react-router-dom";

let currentUser = localStorage.getItem('logged_user');

function FavoriteBookList({user}) {
    currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [books, setBooks] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);

    const navigate = useNavigate();

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/favoriteBooks/${user}`);

            // Returns book.id and book.title
            setBooks(response.data.map(book => ({
                id: book.id.replace(/"/g, ''),
                title: book.title.replace(/"/g, '')
            })));

            // Save all book ids in favoriteBooks
            currentUser['favoriteBooks'] = response.data.map(book => book.id.replace(/"/g, ''));

            localStorage.setItem('logged_user', JSON.stringify(currentUser));
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [user]);

    const loadAllBooks = () => {
        setDisplayCount(books.length);
    };

    async function removeFavorite(book) {
        console.log("Favorites before: " + currentUser["favoriteBooks"])
        console.log("Removing " + book + " from favorites of " + currentUser["_id"] + "...");

        // Removea book from favorite list in database
        await axios.delete(`http://localhost:8080/api/removeFavoriteBook/${currentUser["_id"]}/${book}`);
        setBooks(books.filter(item => item !== book));

        // Remove book from favorite list in local storage
        currentUser['favoriteBooks'].splice(currentUser["favoriteBooks"].indexOf(book), 1);

        localStorage.setItem('logged_user', JSON.stringify(currentUser));

        console.log("Removed " + book + " from favorites of " + currentUser["_id"]);
        console.log("Favorites after: " + currentUser["favoriteBooks"])
    }

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`);
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 5,
        width: '100%'
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5">Favorite books</Typography>
            <List sx={ListStyle}>
                {books.length === 0 ? (
                    <ListItem>
                        <Typography>No books to show</Typography>
                    </ListItem>
                ) : (
                    Array.isArray(books) && books.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                <Link onClick={() => {
                                    seeDetails(book.id)
                                }} sx={{color: "#000000"}}>
                                    <Typography>{book.title}</Typography>
                                </Link>
                                {/* Allow to remove favorite books only on personal profile */}
                                {currentUser["_id"] === user && (
                                    <Tooltip title="Remove from favorites">
                                        <IconButton sx={{color: blue[500], '&:hover': {color: red[500]}}}
                                                    onClick={() => removeFavorite(book.id)}>
                                            <BookmarkRemoveIcon/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItem>
                            <Divider variant="middle" component="li"/>
                        </React.Fragment>
                    ))
                )}
            </List>
            {books.length > displayCount && (
                <Button sx={{backgroundColor: blue[100], marginTop: "10px", height: "30px",
                            '&:hover': {backgroundColor: blue[100]}}}
                        variant="filledTonal" onClick={loadAllBooks}>
                    <Typography>Show all</Typography>
                </Button>
            )}
        </Paper>
    );
}

export default FavoriteBookList;
