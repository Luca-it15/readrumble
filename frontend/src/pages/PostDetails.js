import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Rating} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useParams, useNavigate, useHistory, useLocation} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {red, blue} from "@mui/material/colors";
import {Alert} from '@mui/material';
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddTwoTone";
import DateFormatter from '../components/DataFormatter';
import {Box, Card, CardContent} from '@mui/material';
import RatingStars from '../components/RatingStars';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {ArrowBack} from '@mui/icons-material';
import TagIcon from '@mui/icons-material/Tag';
import Tags from '../components/Tags';
import GoBack from '../components/GoBack';
import moment from 'moment';


function PostDetails() {
    // Fetch post details from database
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [rating, setRating] = useState('');
    const [date, setDate] = useState('');
    const [postUser, setPostUser] = useState(false);
    const [isAdmin, setIsAdmin] = useState(
        JSON.parse(localStorage.getItem('isAdmin')) || false
    );

    let currentUser = localStorage.getItem('logged_user');
// Verifica se il valore è presente
    if (currentUser) {
        // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
        currentUser = JSON.parse(currentUser);
    } else {
        // La chiave 'isLoggedIn' non è presente in localStorage
        console.log('La chiave "logged_user" non è presente in localStorage.');
    }

    let {id} = useParams();
    let id_num = parseInt(id);

    console.log(id + "di tipo" + typeof id);
    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
    });
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();


    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleGoBack() {
        navigate(-1);
    }

    function timeout_text(text) {
        let status = text;
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setLoginStatus({message: '', variant: status});
            handleGoBack();
        }, 6000)
    }


    const fetchPost = async () => {
        try {
            if (id_num != 0) {
                const response = await axios.get('http://localhost:8080/api/post/details/' + id);

                setPost(response.data);
                setTags(response.data.tags);
                setRating(response.data.rating);
                setDate(response.data.date_added);
                console.log(response.data.date_added);
                if (currentUser['_id'] === response.data.username)
                    setPostUser(true);
            } else {

                const actualPost = JSON.parse(localStorage.getItem('post_details'));
                console.log(actualPost[0]);
                setPost(actualPost[0]);
                setTags(actualPost[0].tag);
                console.log(actualPost[0].tag);
                setDate(actualPost[0].date_added);
                console.log(actualPost[0].date_added);
                setRating(actualPost[0].rating);
                if (currentUser['_id'] === actualPost[0].username)
                    setPostUser(true);
            }
        } catch (error) {
            console.log(error.response)
        }
    }
    const removePost = (id) => async () => {
        try {
            let input = date;
            let dateTime = new Date(input);
            let hours = dateTime.getHours();
            let minutes = dateTime.getMinutes();
            let seconds = dateTime.getSeconds();

            // Aggiungi uno zero davanti se le ore, i minuti o i secondi sono minori di 10
            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            let time = hours + ":" + minutes + ":" + seconds;

            let arrayPostJson = localStorage.getItem('last_posts');
            let arrayPost = JSON.parse(arrayPostJson);

            let dateToFind = date;
            let postExists = arrayPost.some(post => post.date_added === dateToFind);


            if (postExists === true) {

                let postFilter = arrayPost.filter(post => post.date_added != dateToFind);

                let postFilterJson = JSON.stringify(postFilter);
                localStorage.removeItem('post_details');

                if (postFilter != null)
                    localStorage.setItem('last_posts', postFilterJson);


                const key = "post:" + time + ":" + post.username + ":" + post.book_id + ":" + post.rating + ":" + post.bookmark + ":" + post.pages_read;
                const response = await axios.delete('http://localhost:8080/api/post/removeredis/' + key);


                setLoginStatus({message: response.data, variant: 'success'});
                handleClose();
                timeout_text("success");
                console.log('cancellation successfull!');
            } else {
                const response = await axios.delete('http://localhost:8080/api/post/removemongo/' + id);


                setLoginStatus({message: response.data, variant: 'success'});
                handleClose();
                timeout_text("success");
                console.log('cancellation successfull!');
            }

        } catch (error) {
            console.error('Error during the cancellation:', error);
            setLoginStatus({
                message: error.response ? JSON.stringify(error.response.data) : error.message,
                variant: 'danger'
            });
            timeout_text("error");
        }
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '30px',
        borderRadius: 5
    }

    const DescriptionPaperStyle = {
        backgroundColor: '#ffffff',
        padding: '30px',
        margin: '10px',
        borderRadius: 5,
    }

    useEffect(() => {
        fetchPost();
    }, [id]);
    return (
        <Paper sx={PaperStyle}>
            <GoBack/>
            <Typography variant="h5" fontWeight="bold" textAlign="center"
                        marginBottom="20px">{post.book_title}</Typography>
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={3}>
                <Grid item xs={8}>
                    <Paper elevation={0} sx={{padding: '10px', margin: '30px', borderRadius: 5}}>
                            <Typography variant="h4"> {post.username}</Typography>
                            <Typography variant="h5">Bookmark: {post.bookmark}</Typography>
                            <Tags tags={tags}/>
                            <Typography variant="h5"><DateFormatter timestamp={date}/></Typography>
                            <Typography variant="h6" component="div">
                                <RatingStars
                                    onChange={rating}
                                    readOnly={true}
                                    isStatic={true}
                                    star={rating}
                                />
                            </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={11}>
                    {(post.rating != 0) ? (
                        <Paper elevation={0} sx={DescriptionPaperStyle}>
                            <Typography variant="h5">Description</Typography>
                            <Typography>{post.review_text}</Typography>
                        </Paper>
                    ) : (
                        <Paper elevation={0} sx={DescriptionPaperStyle}>
                            <Typography variant="h5">Description</Typography>
                            <Typography>I reached the page {post.pages_read}</Typography>
                        </Paper>
                    )}
                </Grid>
                {(postUser || isAdmin) && (
                    <React.Fragment>
                        <Button onClick={handleClickOpen}
                                sx={{backgroundColor: red[300], margin: "5px", '&:hover': {backgroundColor: red[400]}}}
                                variant="filledTonal">
                            <Typography>Remove</Typography>
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Conferma eliminazione"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    are you sure?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    <Typography>No</Typography>
                                </Button>
                                <Button onClick={removePost(id)}>
                                    <Typography>Yes</Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                )}
                {validationError && (
                    <Alert variant="danger">
                        {validationError}
                    </Alert>
                )}

                {loginStatus.message && (
                    <Alert variant={loginStatus.variant}>
                        {loginStatus.message}
                    </Alert>
                )}
            </Grid>
        </Paper>
    );
}

export default PostDetails;