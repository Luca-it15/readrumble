import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue} from "@mui/material/colors";

let currentUser = JSON.parse(localStorage.getItem('logged_user'));

function RecentlyReadBooks({user}) {
    const [recentlyReadBooks, setRecentlyReadBooks] = useState([currentUser['recentlyReadBooks']]);
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
        if (user === currentUser['_id']) {
            setRecentlyReadBooks(currentUser['recentlyReadBooks']);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/book/recentlyReadBooks/${user}`);

            console.log("Recently read books: " + JSON.stringify(response.data));

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
        margin: '20px 10px 0px 10px',
        borderRadius: 5,
        width: '100%'
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5">Recently read</Typography>
            <List sx={ListStyle}>
                {recentlyReadBooks.length === 0 ? (
                    <ListItem>
                        <Typography>No books to show</Typography>
                    </ListItem>
                ) : (
                    Array.isArray(recentlyReadBooks) && recentlyReadBooks.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
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
            {recentlyReadBooks.length > displayCount && (
                <Button sx={{backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}}}
                        variant="filledTonal" onClick={loadAllBooks}>
                    <Typography>Show all</Typography>
                </Button>
            )}
        </Paper>
    );
}

export default RecentlyReadBooks;