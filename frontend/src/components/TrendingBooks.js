import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {blue} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CircularProgress from '@mui/material/CircularProgress';

function TrendingBooks() {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [isLoading, setIsLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    const fetchTrendingBooks = async () => {
        let trendingBooks = JSON.parse(localStorage.getItem('trendingBooks'));

        if (trendingBooks && trendingBooks.length > 0) {
            const booksData = trendingBooks.map(book => ({
                id: book.id,
                title: book.title
            }));
            setBooks(booksData);
            setIsLoading(false);

            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/book/trending`);

            if (response.data.length === 0) {
                setBooks([]);
            } else {
                const booksData = response.data.map(book => ({
                    id: book.id,
                    title: book.title.replace(/"/g, '')
                }));
                setBooks(booksData);
                localStorage.setItem('trendingBooks', JSON.stringify(booksData));
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchTrendingBooks();
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
            <Typography variant="h5" sx={{textAlign: 'center'}}>Trending books<TrendingUpIcon
                sx={{color: blue[400], marginLeft: '10px'}}/></Typography>

            {isLoading ?
                <CircularProgress sx={{marginY: '50px'}}/>
                : (
                <React.Fragment>
                    {books.length === 0 ? (
                        <List sx={ListStyle}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                <Typography sx={{textAlign: 'center'}}>No books to show</Typography>
                            </ListItem>
                        </List>
                    ) : (
                        <List sx={ListStyle}>
                            {books.map((book, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa", borderRadius: '30px'}}}>
                                        <Link onClick={() => {
                                            seeDetails(book.id)
                                        }} sx={{color: "#000000"}}>
                                            <Typography>
                                                <strong>{(index + 1) + '. '}</strong>
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

export default TrendingBooks;