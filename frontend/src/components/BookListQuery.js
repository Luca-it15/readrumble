import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {blue} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CircularProgress from '@mui/material/CircularProgress';

function BookListQuery({query}) {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [isLoading, setIsLoading] = useState(true);

    if (!currentUser['following']) {
        currentUser['following'] = [];
    }

    const usernames = Array.isArray(currentUser['following']) ? currentUser['following'] : currentUser['following'].split(",");
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    const fetchLastBooksOfFriends = async () => {
        if (usernames.length === 0) {
            return;
        }

        try {
            const usernamesString = usernames.join(",");
            const response = await axios.get(`http://localhost:8080/api/book/friendsRecentlyReadBooks?usernames=${usernamesString}`);

            // Returns book.id and book.title
            setBooks(response.data.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            })));

            setIsLoading(false);
        } catch (error) {
            console.log(error.response)
        }
    };

    const fetchTrendingBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/trending`);

            // Returns book.id and book.title
            setBooks(response.data.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            })));

            setIsLoading(false);
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        switch (query) {
            case 'trending':
                fetchTrendingBooks();
                break;
            case 'friends':
                fetchLastBooksOfFriends();
                break;
        }
    }, [currentUser['_id']]);

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`);
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        borderRadius: '30px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    }

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    return (
        <Paper sx={PaperStyle}>
            {query === 'trending' ? (
                <Typography variant="h5" sx={{textAlign: 'center'}}>Trending books<TrendingUpIcon
                    sx={{color: blue[400], marginLeft: '10px'}}/></Typography>
            ) : (
                <Typography variant="h5" sx={{textAlign: 'center'}}>Recently read by friends</Typography>
            )}

            {isLoading ?
                <CircularProgress sx={{marginY: '50px'}}/>
                : (
                <React.Fragment>
                    {currentUser['following'].length === 0 ? (
                        <List sx={ListStyle}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                <Typography sx={{textAlign: 'center'}}>You are not following anyone yet</Typography>
                            </ListItem>
                        </List>
                    ) : (
                        <List sx={ListStyle}>
                            {books.map((book, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                        <Link onClick={() => {
                                            seeDetails(book.id)
                                        }} sx={{color: "#000000"}}>
                                            <Typography>
                                                {query === 'trending' && <strong>{(index + 1) + '. '}</strong>}
                                                {book.title}
                                            </Typography>
                                        </Link>
                                    </ListItem>
                                    <Divider variant="middle" component="li"/>
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </React.Fragment>
            )}
        </Paper>
    );
}

export default BookListQuery;