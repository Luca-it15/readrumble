import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, Paper} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from 'react-router-dom';
import Button from "@mui/material-next/Button";
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {blue, red, yellow, green} from "@mui/material/colors";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemoveTwoTone";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";
import {FavoriteTwoTone} from "@mui/icons-material";
import UpdateIcon from '@mui/icons-material/EditTwoTone';
import RemoveIcon from '@mui/icons-material/DeleteTwoTone';
import GoBack from "../components/GoBack";
import PostList from "../components/PostList";
import ReadIcon from '@mui/icons-material/AutoStoriesTwoTone';

function BookDetails() {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [book, setBook] = useState([]);
    let {id} = useParams();
    let [authors, setAuthors] = useState([]);
    let [tags, setTags] = useState([]);
    let [favorites, setFavorites] = useState(currentUser['favoriteBooks']);
    let [wishlist, setWishlist] = useState(currentUser['wishlist']);
    let [isActiveBook, setIsActiveBook] = useState(false);
    let [hiddenReview, setHiddenReview] = useState(true);
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin')) || false;

    let favoriteBooksIds = [];
    let wishlistBooksIds = [];
    let activeBooksIds = [];
    const [deleteStatus, setDeleteStatus] = useState({
        message: '',
        variant: 'success',
    });

    id = parseInt(id)

    if (!isAdmin) {
        if (currentUser['favoriteBooks'].length > 0) {
            favoriteBooksIds = currentUser['favoriteBooks'].map(book => book.id);
        }

        if (currentUser['wishlist'].length > 0) {
            wishlistBooksIds = currentUser['wishlist'].map(book => book.id);
        }

        if (currentUser['currentlyReading'].length > 0) {
            activeBooksIds = currentUser['currentlyReading'].map(book => book.id);
            activeBooksIds = activeBooksIds.concat(currentUser['recentlyReadBooks'].map(book => book.id));
            isActiveBook = activeBooksIds.includes(id);
        }
    }

    const [isFavorite, setFavorite] = useState(currentUser &&
        favoriteBooksIds && favoriteBooksIds.includes(id));
    const [isInWishlist, setInWishlist] = useState(currentUser &&
        wishlistBooksIds && wishlistBooksIds.includes(id));

    const navigate = useNavigate();
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
        margin: '20px 10px 10px 10px',
        borderRadius: 5,
        width: '85vw'
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

    function handleSeeReviews() {
        setHiddenReview(false);
    }

    function handleHideReviews() {
        setHiddenReview(true);
    }

    const toggleFavorite = (id, isFavorite) => async () => {
        if (isFavorite) {
            // Removes a book from favorite list in database
            await axios.delete(`http://localhost:8080/api/book/removeFavoriteBook/${currentUser["_id"]}/${id}`);

            const bookToRemove = {
                id: id,
                title: book['title']
            }

            // Remove book from favorite list in local storage
            const updatedFavorites = favorites.filter(item => item.id !== bookToRemove.id);

            setFavorites(updatedFavorites);
            currentUser['favoriteBooks'] = updatedFavorites;
        } else {
            // Add a book to favorite list in database
            await axios.post(`http://localhost:8080/api/book/addFavoriteBook/${currentUser["_id"]}/${id}`);

            const newFavoriteBook = {
                id: id,
                title: book['title']
            }

            // Add book to favorite list in local storage
            currentUser['favoriteBooks'].push(newFavoriteBook);
        }

        localStorage.setItem('logged_user', JSON.stringify(currentUser));

        setFavorite(!isFavorite);
    }

    const toggleInWishlist = (isInWishlist, id, title, pages, tags) => async () => {
        const bookInfo = {
            book_id: id,
            book_title: title,
            num_pages: pages,
            tags: tags
        }

        if (isInWishlist) {
            // Removes a book from favorite list in database
            await axios.delete(`http://localhost:8080/api/book/removeFromWishlist/${currentUser["_id"]}/${id}`);

            // Remove book from wishlist in local storage
            const updatedWishlist = currentUser['wishlist'].filter(item => item.id !== bookInfo.book_id);
            setWishlist(updatedWishlist);

            currentUser['wishlist'] = updatedWishlist;
        } else {
            // Add a book to favorite list in database
            await axios.post(`http://localhost:8080/api/book/addToWishlist/${currentUser['_id']}/${id}`, bookInfo);

            const newWishlistBook = {
                id: bookInfo['book_id'],
                title: bookInfo['book_title']
            }

            // Add book to favorite list in local storage
            currentUser['wishlist'].push(newWishlistBook);
            setWishlist([...wishlist, newWishlistBook]);
        }

        localStorage.setItem('logged_user', JSON.stringify(currentUser));

        setInWishlist(!isInWishlist);
    }

    const [open, setOpen] = useState(false);
    const [bookId, setBookId] = useState(null);

    const handleClickOpen = (id) => {
        setBookId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const removeBook = (id) => async () => {
        axios.delete("http://localhost:8080/api/admin/book/remove/" + id)
            .then(() => {
                setOpen(false);
                setTimeout(function () {
                    setDeleteStatus({message: "", variant: 'success'});
                    navigate(-1)
                }, 4000)
            });
    }

    const updateBook = (id) => async () => {
        navigate(`/updateBook/${id}`);
    }

    const startReading = () => async () => {
        const bookInfo = {
            id: id,
            title: book['title'],
            num_pages: book['num_pages'],
            tags: book['tags']
        }

        await axios.post(`http://localhost:8080/api/book/startReading/${currentUser['_id']}/${id}`, bookInfo);

        currentUser['currentlyReading'].unshift({
            id: bookInfo['id'],
            title: bookInfo['title'],
            bookmark: 0,
            num_pages: bookInfo['num_pages'],
            tags: bookInfo['tags']
        });

        localStorage.setItem('logged_user', JSON.stringify(currentUser));

        setIsActiveBook(true);

        // Remove book from wishlist if it's there
        if (currentUser['wishlist'].length > 0) {
            const updatedWishlist = currentUser['wishlist'].filter(item => item.id !== id);
            setWishlist(updatedWishlist);
            currentUser['wishlist'] = updatedWishlist;
            localStorage.setItem('logged_user', JSON.stringify(currentUser));
        }
    }

    return (
        <Paper sx={PaperStyle}>
            <GoBack/>
            <Typography variant="h4" fontWeight="bold" textAlign="center">{book['title']}</Typography>
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}
                  sx={{marginTop: '10px'}}>
                <Grid container item xs={3} direction="column" alignItems="center">
                    <img alt="Book cover" src={book['image_url']} height="280px"
                         style={{boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.2)'}}/>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h5">By: <i>{authors}</i></Typography>
                    <Typography>Publisher: <i>{book['publisher']}</i></Typography>
                    <Typography>Publication year: <i>{book['publication_year']}</i></Typography>
                    <Typography>ISBN: <i>{book['isbn']}</i></Typography>
                    <Typography>Pages: <i>{book['num_pages']}</i></Typography>
                </Grid>

                <Grid container item direction="column" alignItems="center" justifyContent="center" xs={3}>
                    {isAdmin ? (
                        <React.Fragment>
                            <Typography variant='h6'>Admin actions:</Typography>
                            <Button onClick={updateBook(id)} sx={{
                                backgroundColor: green[200],
                                margin: "5px",
                                '&:hover': {backgroundColor: green[100]}
                            }}
                                    variant="filledTonal" startIcon={<UpdateIcon sx={{color: green[600]}}/>}>
                                <Typography>Edit book data</Typography>
                            </Button>
                            <Button onClick={() => handleClickOpen(id)} sx={{
                                backgroundColor: red[200],
                                margin: "5px",
                                '&:hover': {backgroundColor: red[100]}
                            }}
                                    variant="filledTonal" startIcon={<RemoveIcon sx={{color: '#bd3838'}}/>}>
                                <Typography>Remove book</Typography>
                            </Button>

                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Delete the book: "{book['title']}"</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        <Typography>
                                            Are you sure?
                                        </Typography>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{
                                        color: '#ffffff',
                                        backgroundColor: blue[400],
                                        marginRight: '20%',
                                        '&:hover': {backgroundColor: blue[300]}
                                    }} onClick={handleClose}><Typography>No</Typography></Button>
                                    <Button sx={{
                                        color: blue[200],
                                        marginRight: '22%',
                                        '&:hover': {backgroundColor: red[300], color: '#ffffff'}
                                    }} onClick={removeBook(id)}><Typography>Yes</Typography></Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {isFavorite ? (
                                <Button onClick={toggleFavorite(id, isFavorite)} sx={{
                                    backgroundColor: blue[200],
                                    margin: "5px",
                                    '&:hover': {backgroundColor: blue[100]}
                                }}
                                        variant="filledTonal" startIcon={<FavoriteTwoTone sx={{color: red[600]}}/>}>
                                    <Typography>Remove from favorites</Typography>
                                </Button>
                            ) : (
                                isActiveBook ? (
                                    <Button onClick={toggleFavorite(id, isFavorite)} sx={{
                                        backgroundColor: blue[200],
                                        margin: "5px",
                                        '&:hover': {backgroundColor: blue[100]}
                                    }}
                                            variant="filledTonal"
                                            startIcon={<FavoriteTwoTone sx={{color: '#dddddd'}}/>}>
                                        <Typography>Add to favorites</Typography>
                                    </Button>
                                ) : (
                                    <Button onClick={startReading(id)} sx={{
                                        backgroundColor: green[200],
                                        margin: "5px",
                                        '&:hover': {backgroundColor: green[100]}
                                    }}
                                            variant="filledTonal" startIcon={<ReadIcon sx={{color: green[700]}}/>}>
                                        <Typography>Start reading</Typography>
                                    </Button>
                                )
                            )}

                            {!isActiveBook &&
                                (isInWishlist ? (
                                    <Button
                                        onClick={toggleInWishlist(true, id, book['title'], book['num_pages'], book['tags'])}
                                        sx={{
                                            backgroundColor: blue[200],
                                            margin: "5px",
                                            '&:hover': {backgroundColor: blue[100]}
                                        }}
                                        variant="filledTonal" startIcon={<BookmarkRemoveIcon sx={{color: blue[700]}}/>}>
                                        <Typography>Remove from wishlist</Typography>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={toggleInWishlist(false, id, book['title'], book['num_pages'], book['tags'])}
                                        sx={{
                                            backgroundColor: blue[200],
                                            margin: "5px",
                                            '&:hover': {backgroundColor: blue[100]}
                                        }}
                                        variant="filledTonal" startIcon={<BookmarkAddIcon sx={{color: blue[700]}}/>}>
                                        <Typography>Add to wishlist</Typography>
                                    </Button>
                                ))}
                        </React.Fragment>)}
                    {hiddenReview ? (
                        <Button onClick={handleSeeReviews}
                                sx={{
                                    backgroundColor: blue[200],
                                    margin: "5px",
                                    '&:hover': {backgroundColor: blue[100]}
                                }}
                                variant="filledTonal"
                                startIcon={<StarTwoToneIcon sx={{color: yellow[400]}}/>}>
                            <Typography>See reviews</Typography>
                        </Button>
                    ) : (
                        <Button onClick={handleHideReviews}
                                sx={{
                                    backgroundColor: blue[200],
                                    margin: "5px",
                                    '&:hover': {backgroundColor: blue[100]}
                                }}
                                variant="filledTonal" startIcon={<StarTwoToneIcon sx={{color: yellow[400]}}/>}>
                            <Typography>Hide reviews</Typography>
                        </Button>)}
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography sx={{
                        marginLeft: '30px',
                        marginRight: '30px',
                        textAlign: 'center'
                    }}>Tags: <i>{tags}</i></Typography>
                    {hiddenReview ? (
                        <Paper elevation={0} sx={DescriptionPaperStyle}>
                            <Typography variant="h5">Description</Typography>
                            <Typography>{book['description']}</Typography>
                        </Paper>
                    ) : (
                        <Grid container item xs={12} direction="column" alignItems="center">
                            <Typography variant="h5" sx={{textAlign: 'center', marginTop: '30px'}}>Reviews</Typography>
                            <PostList user={false} book_id={id} username={currentUser['_id']} size={5} all={false} path={1}/>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
}

export default BookDetails;