import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Link, List, ListItem } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { BookTwoTone } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function BookListQuery() {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [isLoading, setIsLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    const fetchLastBooksOfFriends = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/friendsRecentlyReadBooks/${currentUser['_id']}`);

            if (response.data.length === 0) {
                setBooks([]);
            } else {
                // Returns book.id and book.title
                setBooks(response.data.map(book => ({
                    id: book.id,
                    title: book.title.replace(/"/g, '')
                })));
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error.response)
        }
    };

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`);
    }

    const AccordionStyle = {
        backgroundColor: '#f1f7fa',
        borderRadius: '20px !important',
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
        <Accordion sx={AccordionStyle} onChange={(event, isExpanded) => {
            if (isExpanded)
                fetchLastBooksOfFriends();
            }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="friendsBooks-content"
                id="friendsBooks-header"
            >
                <BookTwoTone sx={{ color: blue[500], height: '30px' }}/>
                <Typography variant="h5" sx={{ width: '100%' }}>Recently read by friends</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                                                <Typography>{book.title}</Typography>
                                            </Link>
                                        </ListItem>
                                        <Divider variant="middle" component="li"/>
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </React.Fragment>
                )}
            </AccordionDetails>
        </Accordion>
    );
}

export default BookListQuery;