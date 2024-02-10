import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue, red} from "@mui/material/colors";

function RecentlyReadBooks({user}) {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    let initialRecentlyReadBooks;

    if (user === currentUser['_id']) {
        if (!currentUser['recentlyReadBooks']) {
            currentUser['recentlyReadBooks'] = [];
        }

        initialRecentlyReadBooks = currentUser['recentlyReadBooks'];
    } else {
        initialRecentlyReadBooks = [];
    }

    const [recentlyReadBooks, setRecentlyReadBooks] = useState(initialRecentlyReadBooks);
    const [displayCount, setDisplayCount] = useState(6);

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
        if (currentUser['recentlyReadBooks'].length === 0) {
            setRecentlyReadBooks([]);
        }

        if (user === currentUser['_id'] && currentUser['recentlyReadBooks']) {
            setRecentlyReadBooks(currentUser['recentlyReadBooks']);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/book/recentlyReadBooks/${user}`);

            const booksReceived = JSON.parse(JSON.stringify(response.data));

            // Returns book.id and book.title
            setRecentlyReadBooks(booksReceived.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            })));

            // Save all book ids in favoriteBooks
            currentUser['recentlyReadBooks'] = response.data.map(book => book.id.replace(/"/g, ''));

            localStorage.setItem('logged_user', JSON.stringify(currentUser));
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [user]);

    const loadAllBooks = () => {
        setDisplayCount(recentlyReadBooks.length);
    };

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`);
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        borderRadius: 5,
        width: '100%'
    }

    function loadLessBooks() {
        setDisplayCount(6);
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5" sx={{marginBottom:'5px'}}>Recently read</Typography>
            <List sx={ListStyle}>
                {recentlyReadBooks.length === 0 ? (
                    <ListItem>
                        <Typography>No books to show</Typography>
                    </ListItem>
                ) : (
                    Array.isArray(recentlyReadBooks) && recentlyReadBooks.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa", borderRadius: '30px'}}}>
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
            {displayCount < recentlyReadBooks.length ? (
                <Button onClick={loadAllBooks} sx={{
                    backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}
                }}
                    variant="filledTonal"><Typography>Show more</Typography></Button>
            ) : (
                recentlyReadBooks.length > displayCount && (
                    <Button onClick={loadLessBooks} sx={{
                        backgroundColor: red[100], marginTop: "10px", height: "30px",
                        '&:hover': {backgroundColor: red[100]}
                    }}
                            variant="filledTonal"><Typography>Show less</Typography></Button>
                )
            )}
        </Paper>
    );
}

export default RecentlyReadBooks;