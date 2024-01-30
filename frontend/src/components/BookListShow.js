import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue} from "@mui/material/colors";

function BookListShow({title, path}) {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);


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

            if(path == 0) {
            const response = await axios.get(`http://localhost:8080/api/search/books`);

            const books = response.data
            // Returns book.id and book.title
            setBooks(books.map(book => ({
                id: book.id,
                title: book.title
            })));
        } else { 
         const response = await axios.get(`http://localhost:8080/api/search/books/${title}}`);
 
         const books = response.data
        // Returns book.id and book.title
         setBooks(books.map(book => ({
            id: book.id,
            title: book.title
         })));
        }
         
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [title]);

    const loadAllBooks = () => {
        setDisplayCount(books.length);
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
                            </ListItem>
                            <Divider variant="middle" component="li"/>
                        </React.Fragment>
                    ))
                )}
            </List>
            {books.length > displayCount && (
                <Button sx={{
                    backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}
                }}
                        variant="filledTonal" onClick={loadAllBooks}>
                    <Typography>Show all</Typography>
                </Button>
            )}
        </Paper>
    );
}

export default BookListShow;