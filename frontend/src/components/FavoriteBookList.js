import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {blue} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";
import {FavoriteTwoTone} from "@mui/icons-material";

function FavoriteBookList({user}) {
    const currentUser = JSON.parse(localStorage.getItem('logged_user'));

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
        if (user === currentUser['_id'] && currentUser['favoriteBooks'] && currentUser['favoriteBooks'].length > 0) {
            setBooks(currentUser['favoriteBooks']);
            console.log(currentUser['favoriteBooks'])
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/favoriteBooks/${user}`);

            // Returns book.id and book.title
            setBooks(response.data.map(book => ({
                id: book.id.replace(/"/g, ''),
                title: book.title.replace(/"/g, '')
            })));

            // Save all book ids in favoriteBooks
            currentUser['favoriteBooks'] = books;

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
        console.log("Removing " + book.title + " from favorites of " + currentUser["_id"] + "...");

        // Removea book from favorite list in database
        await axios.delete(`http://localhost:8080/api/removeFavoriteBook/${currentUser["_id"]}/${book.id}`);

        // Remove book from favorite list in local storage
        setBooks(books.filter(item => item.id !== book.id && item.title !== book.title));
        currentUser['favoriteBooks'] = books;

        localStorage.setItem('logged_user', JSON.stringify(currentUser));

        console.log("Removed " + book.title + " from favorites of " + currentUser["_id"]);
        console.log("Favorites after: " + JSON.parse(currentUser["favoriteBooks"]))
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
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}
                                      secondaryAction={currentUser["_id"] === user && (
                                          <Tooltip title="Remove from favorites">
                                              <IconButton sx={{color: blue[500], '&:hover': {color: '#bbbbbb'}}}
                                                          onClick={() => removeFavorite(book)}>
                                                  <FavoriteTwoTone/>
                                              </IconButton>
                                          </Tooltip>
                                      )}>
                                <Link onClick={() => {
                                    seeDetails(book.id)
                                }} sx={{color: "#000000"}}>
                                    <Typography>{book.title}</Typography>
                                </Link>
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