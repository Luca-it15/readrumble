import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, Paper} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {blue, yellow} from "@mui/material/colors";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";

function BookDetails() {
    // Fetch book details from database
    const [book, setBook] = useState([]);
    let {id} = useParams();

    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [isFavorite, setFavorite] = useState(currentUser &&
        currentUser['favoriteBooks'] && currentUser['favoriteBooks'].includes(id));

    const fetchBook = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/book/' + id);

            setBook(JSON.parse(JSON.stringify(response.data)));
        } catch (error) {
            console.log(error.response)
        }
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 5
    }

    const DescriptionPaperStyle = {
        backgroundColor: '#ffffff',
        padding: '30px',
        margin: '10px',
        borderRadius: 5,
    }

    useEffect(() => {
        fetchBook();
    }, [id]);

    function seeReviews(id) {
        // TODO: i Post sono territorio di Luca
        return null
    }

    const toggleFavorite = (id, isFavorite) => async () => {
        if (isFavorite) {
            // Removes a book from favorite list in database
            await axios.delete(`/api/removeFavoriteBook/${currentUser["_id"]}/${id}`);

            // Remove book from favorite list in local storage
            currentUser['favoriteBooks'].splice(currentUser["favoriteBooks"].indexOf(book), 1);
        } else {
            // Add a book to favorite list in database
            await axios.post(`/api/addFavoriteBook/${currentUser["_id"]}/${id}`);

            // Add book to favorite list in local storage
            currentUser['favoriteBooks'].push(book);
        }

        localStorage.setItem('logged_user', JSON.stringify(currentUser));
        setFavorite(!isFavorite);
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h4" fontWeight="bold" textAlign="center"
                        marginBottom="20px">{book['title']}</Typography>
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}>
                <Grid item xs={3} md={2}>
                    <img alt="Book cover" src={book['image_url']} width="100%"/>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h5">By: {book['authors']}</Typography>
                    <Typography>Publisher: {book['publisher']}</Typography>
                    <Typography>Publication year: {book['publication_year']}</Typography>
                    <Typography>ISBN: {book['isbn']}</Typography>
                    <Typography>Pages: {book['num_pages']}</Typography>
                </Grid>
                <Grid container direction="column" alignItems="center" justifyContent="center" xs={4}>
                    <Button onClick={seeReviews(id)}
                            sx={{backgroundColor: blue[200], margin: "5px", '&:hover': {backgroundColor: blue[100]}}}
                            variant="filledTonal" startIcon={<StarTwoToneIcon sx={{color: yellow[400]}}/>}>
                        <Typography>See reviews</Typography>
                    </Button>

                    {isFavorite ? (
                        <Button onClick={toggleFavorite(id)} sx={{
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}
                                variant="filledTonal" startIcon={<BookmarkRemoveIcon sx={{color: blue[700]}}/>}>
                            <Typography>Remove from favorites</Typography>
                        </Button>
                    ) : (
                        <Button onClick={toggleFavorite(id)} sx={{
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}
                                variant="filledTonal" startIcon={<BookmarkAddIcon sx={{color: blue[700]}}/>}>
                            <Typography>Add to favorites</Typography>
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12} md={11}>
                    <Paper elevation={0} sx={DescriptionPaperStyle}>
                        <Typography variant="h5">Description</Typography>
                        <Typography>{book['description']}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default BookDetails;