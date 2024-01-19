import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, Paper} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {blue, red, yellow} from "@mui/material/colors";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";
import {FavoriteTwoTone} from "@mui/icons-material";
import GoBack from "../components/GoBack";
import PostList from "../components/PostList"; 

function BookDetails() {
    // Fetch book details from database
    const [book, setBook] = useState([]);
    let {id} = useParams();
    let [authors, setAuthors] = useState([]);
    let [tags, setTags] = useState([]);
    let [hiddenReview, setHiddenReview] = useState(true); 

    let currentUser = JSON.parse(localStorage.getItem('logged_user'));
    let favoriteBooksIds = [];
    let wishlistBooksIds = [];

    if (currentUser['favoriteBooks'].length > 0) {
        favoriteBooksIds = currentUser['favoriteBooks'].map(book => book.id);
    }
    if (currentUser['wishlist'].length > 0) {
        wishlistBooksIds = currentUser['wishlist'].map(book => book.id);
    }

    const [isFavorite, setFavorite] = useState(currentUser &&
        favoriteBooksIds && favoriteBooksIds.includes(id));
    const [isInWishlist, setInWishlist] = useState(currentUser &&
        wishlistBooksIds && wishlistBooksIds.includes(id));

    const fetchBook = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/book/' + id);

            const data = JSON.parse(JSON.stringify(response.data))
            setAuthors(data['authors'].map(author => author).join(', '))
            setTags(data['tags'].map(tag => tag).join(', '))
            setBook(data);
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

   function handleSeeReview() {
    setHiddenReview(false); 
   }
   
   function handleHiddenReview() {
    setHiddenReview(true); 
   }



    const toggleFavorite = (id, isFavorite) => async () => {
        if (isFavorite) {
            // Removes a book from favorite list in database
            await axios.delete(`http://localhost:8080/api/removeFavoriteBook/${currentUser["_id"]}/${id}`);

            // Remove book from favorite list in local storage
            currentUser['favoriteBooks'].splice(currentUser["favoriteBooks"].indexOf(book), 1);
        } else {
            // Add a book to favorite list in database
            await axios.post(`http://localhost:8080/api/addFavoriteBook/${currentUser["_id"]}/${id}`);

            // Add book to favorite list in local storage
            currentUser['favoriteBooks'].push(book);
        }

        localStorage.setItem('logged_user', JSON.stringify(currentUser));
        setFavorite(!isFavorite);
    }

    const toggleInWishlist = (id, isInWishlist) => async () => {
        if (isInWishlist) {
            // Removes a book from favorite list in database
            await axios.delete(`http://localhost:8080/api/book/removeFromWishlist/${currentUser["_id"]}/${id}`);

            // Remove book from favorite list in local storage
            currentUser['wishlist'].splice(currentUser["wishlist"].indexOf(book), 1);
        } else {
            // Add a book to favorite list in database
            await axios.post(`http://localhost:8080/api/book/addToWishlist/${currentUser["_id"]}/${id}`);

            // Add book to favorite list in local storage
            currentUser['wishlist'].push(book);
        }

        localStorage.setItem('logged_user', JSON.stringify(currentUser));
        setInWishlist(!isInWishlist);
    }

    // TODO sistemare
    //const authors = (book['authors'] > 1) ? book['authors'].map(author => author).join(', ') : book['authors'];

    return (
        <Paper sx={PaperStyle}>
            <GoBack/>
            <Typography variant="h4" fontWeight="bold" textAlign="center"
                        marginBottom="20px">{book['title']}</Typography>
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}>
                <Grid item xs={3} md={2}>
                    <img alt="Book cover" src={book['image_url']} width="100%"/>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h5">By: {authors}</Typography>
                    <Typography>Publisher: {book['publisher']}</Typography>
                    <Typography>Publication year: {book['publication_year']}</Typography>
                    <Typography>ISBN: {book['isbn']}</Typography>
                    <Typography>Pages: {book['num_pages']}</Typography>
                </Grid>
                <Grid container direction="column" alignItems="center" justifyContent="center" xs={3}>
                    {isFavorite ? (
                        <Button onClick={toggleFavorite(id)} sx={{
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}
                                variant="filledTonal" startIcon={<FavoriteTwoTone sx={{color: red[600]}}/>}>
                            <Typography>Remove from favorites</Typography>
                        </Button>
                    ) : (
                        <Button onClick={toggleFavorite(id)} sx={{
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}
                                variant="filledTonal" startIcon={<FavoriteTwoTone sx={{color: '#bbbbbb'}}/>}>
                            <Typography>Add to favorites</Typography>
                        </Button>
                    )}

                    {isInWishlist ? (
                        <Button onClick={toggleInWishlist(id)} sx={{
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}
                                variant="filledTonal" startIcon={<BookmarkRemoveIcon sx={{color: blue[700]}}/>}>
                            <Typography>Remove from wishlist</Typography>
                        </Button>
                    ) : (
                        <Button onClick={toggleInWishlist(id)} sx={{
                            backgroundColor: blue[200],
                            margin: "5px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}
                                variant="filledTonal" startIcon={<BookmarkAddIcon sx={{color: blue[700]}}/>}>
                            <Typography>Add to wishlist</Typography>
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12} md={11}>
                <Typography sx={{marginLeft: '30px', marginRight: '30px', textAlign: 'center', fontStyle: 'italic'}}>Tags: {tags}</Typography>
                    <Paper elevation={0} sx={DescriptionPaperStyle}>
                        {/* TODO: condizione per mostrare le review oppure la descrizione */}
                        <Typography variant="h5">Description</Typography>
                        <Typography>{book['description']}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} className='choiche' >
                    {hiddenReview ? (<Button onClick={handleSeeReview}
                            sx={{backgroundColor: blue[200], margin: "5px", '&:hover': {backgroundColor: blue[100]}}}
                            variant="filledTonal" startIcon={<StarTwoToneIcon sx={{color: yellow[400]}}/>}>
                        <Typography>See reviews</Typography>
                    </Button>) : (
                        <>
                   <Button onClick={handleHiddenReview}
                            sx={{backgroundColor: blue[200], margin: "5px", '&:hover': {backgroundColor: blue[100]}}}
                            variant="filledTonal" startIcon={<StarTwoToneIcon sx={{color: yellow[400]}}/>}>
                        <Typography>Hide reviews</Typography>
                    </Button>     
                  <Typography variant="h4"  className="mt-5 mb-3">Book's reviews</Typography>
                   <PostList user={false} book_id={id} username={currentUser['_id']}/> 
                    </>                   
                   )}
                </Grid>
            </Grid>
        </Paper>
    );
}

export default BookDetails;