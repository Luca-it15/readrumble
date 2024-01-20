import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemoveTwoTone';
import {blue, red} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function TrendingBooks() {
    const [books, setBooks] = useState([]);

    const navigate = useNavigate();

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/trending`);

            // Returns book.id and book.title
            setBooks(response.data.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            })));
        } catch (error) {
            console.log(error.response)
        }
    };

    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    useEffect(() => {
        fetchBooks();
    }, [currentUser['_id']]);

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
            <List sx={ListStyle}>
                {books.map((book, index) => (
                    <React.Fragment key={index}>
                        <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                            <Link onClick={() => {
                                seeDetails(book.id)
                            }} sx={{color: "#000000"}}>
                                <Typography><strong>#{index + 1}</strong> {book.title}</Typography>
                            </Link>
                        </ListItem>
                        <Divider variant="middle" component="li"/>
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}

export default TrendingBooks;