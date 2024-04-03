import React, {useEffect, useState} from 'react';
import axios from "axios";
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Link,
    Paper
} from "@mui/material";
import Button from "@mui/material-next/Button";
import {useNavigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {blue, red} from "@mui/material/colors";
import DateFormatter from '../components/DataFormatter';
import RatingStars from '../components/RatingStars';
import Tags from '../components/Tags';
import GoBack from '../components/GoBack';
import DateIcon from "@mui/icons-material/CalendarTodayTwoTone";

function PostDetails() {
    // Fetch post details from database
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [rating, setRating] = useState('');
    const [date, setDate] = useState('');
    const [postUser, setPostUser] = useState(false);
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin')) || false;
    const [postReported, setPostReported] = useState({
        _id: 0,
        book_id: '',
        rating: 0,
        review_text: '',
        date_added: ' ',
        book_title: '',
        username: ' ',
        tag: [],
        bookmark: 0,
        pages_read: 0,
        competitions_name: [],
        competitions_tag: [], 
        reported: false
    });

    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    let {storage, datePost, parameter, user} = useParams();

    const [deletionStatus, seeDeletionStatus] = useState({
        message: '',
        variant: 'success',
    });
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();


    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setPostReported({
            _id: 0,
            book_id: post.book_id,
            rating: post.rating,
            review_text: post.review_text,
            date_added: post.date_added,
            book_title: post.book_title,
            username: post.username,
            tag: post.tags,
            bookmark: post.bookmark,
            pages_read: post.pages_read,
            competitions_name: [],
            competitions_tag: [], 
            reported: true
            }); 
        setOpen(true);
    }
     
     const [submitStatus, setSubmitStatus] = useState({
        message: '',
        variant: 'success', 
     });
    

    const handleClose = () => setOpen(false);

    function handleGoBack() {
        navigate(-1);
    }

    function timeout_text(text) {
        let status = text;
        setTimeout(function () {
            seeDeletionStatus({message: '', variant: status});
            handleGoBack();
        }, 6000)
    }
    
    let username = currentUser['_id']; 

    const fetchPost = async () => {
        try {

            let storageNum = parseInt(storage); 

            if (storageNum === 1) {
                let paramToSend = parameter; 
                if(!user) {
                  paramToSend = parameter.toString(); 
                }
                const response = await axios.get('http://localhost:8080/api/post/details/' + datePost + '/' +  paramToSend + '/' + user);

                setPost(response.data);
                setTags(response.data.tags);
                setRating(response.data.rating);
                setDate(response.data.date_added);
        
                if (currentUser['_id'] === response.data.username)
                    setPostUser(true);
            } else {

                const actualPost = JSON.parse(localStorage.getItem('post_details'));

                setPost(actualPost[0]);
                setTags(actualPost[0].tag);
                setDate(actualPost[0].date_added);
                setRating(actualPost[0].rating);

                if (currentUser['_id'] === actualPost[0].username)
                    setPostUser(true);
            }
        } catch (error) {
            console.log(error.response)
        }
    }
    const removePost = (book_id) => async () => {
        try {
            let dateTime = new Date(date);
            let hours = dateTime.getHours();
            let minutes = dateTime.getMinutes();
            let seconds = dateTime.getSeconds();

            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            let time = hours + ":" + minutes + ":" + seconds;

            let arrayPost = JSON.parse(localStorage.getItem('last_posts'));

            if(arrayPost) {

             let dateToFind = date;
             let postExists = arrayPost.some(post => post.date_added === dateToFind);

             if (postExists === true) {
                let postFilter = arrayPost.filter(post => post.date_added !== dateToFind);
                let postFilterJson = JSON.stringify(postFilter);

                localStorage.removeItem('post_details');

                if (postFilter != null)
                    localStorage.setItem('last_posts', postFilterJson);

                let reported = (isAdmin ? true : false); 

                const key = "post:" + time + ":" + post.username + ":" + post.book_id + ":" + post.rating + ":" + post.bookmark + ":" + post.pages_read + ":" + reported;
                const response = await axios.delete('http://localhost:8080/api/post/removeredis/' + key);

                seeDeletionStatus({message: response.data, variant: 'success'});

                handleClose();

                timeout_text("success");
             } else {
                let paramToSend; 
                if(user) {
                    paramToSend = post.username; 
                } else {
                    paramToSend = parameter.toString(); 
                }
                const response = await axios.delete('http://localhost:8080/api/post/removemongo/' + datePost + '/' + paramToSend + '/'+ user);

                seeDeletionStatus({message: response.data, variant: 'success'});

                handleClose();

                timeout_text("success");
             }
            } else {
                let paramToSend; 
                if(user) {
                    paramToSend = post.username; 
                } else {
                    paramToSend = parameter.toString(); 
                }
                const response = await axios.delete('http://localhost:8080/api/post/removemongo/' + datePost + '/' + paramToSend + '/'+ user);

                seeDeletionStatus({message: response.data, variant: 'success'});

                handleClose();

                timeout_text("success");
            }
        } catch (error) {
            seeDeletionStatus({
                message: error.response ? JSON.stringify(error.response.data) : error.message,
                variant: 'danger'
            });

            timeout_text("error");
        }
    }

    const reportPost = () => async() => {
        try {
            const response = await axios.post('http://localhost:8080/api/post/submit', postReported);
            handleClose(); 
            setSubmitStatus({
                message: JSON.stringify(response.data),
                variant: 'success'
            });
            timeout_text(response.message);
           
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus({
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
        width: '80%',
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
    }, [datePost]);

    function seeProfile(username) {
        if (isAdmin) {
            navigate(`/admin/user/banunban/` + username);
        } else {
            navigate(`/user/${username}/`);
        }
    }

    return (
        <Paper sx={PaperStyle}>
            <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Grid item xs={2}>
                    <GoBack/>
                </Grid>
                <Grid item xs={4}>
                    <Link onClick={() => {
                        seeProfile(post.username)
                    }} sx={{color: '#000000', '&:hover': {cursor: 'pointer'}}}>
                        <Typography variant="h5" textAlign="right">{post.username}</Typography>
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h5"> got to page {post.bookmark} of</Typography>
                </Grid>
                <Grid container item xs={2}>
                    <Typography textAlign="right" sx={{width: '90%'}}>
                        <DateFormatter timestamp={date}/>
                        <DateIcon sx={{color: blue[400], margin: '0px 0px 5px 3px', height: '20px'}}/>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" textAlign="center" marginBottom="20px">{post.book_title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Tags tags={tags}/>
                </Grid>
                <Grid item xs={8}>
                    {post.rating !== 0 ? (
                        <Paper elevation={0} sx={{
                            padding: '10px', margin: '30px', borderRadius: 5, display: 'flex',
                            flexDirection: "column", alignItems: "center", justifyContent: "center"
                        }}>
                            <Typography variant="h5">Post content:</Typography>
                            <RatingStars
                                onChange={rating}
                                readOnly={true}
                                isStatic={true}
                                star={rating}
                            />
                            <Typography textAlign="justify">{post.review_text}</Typography>
                        </Paper>
                    ) : null}
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
                            <DialogTitle id="alert-dialog-title">{"confirm that you want to delete the post?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    are you sure?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    <Typography>No</Typography>
                                </Button>
                                <Button onClick={removePost(post.book_id)}>
                                    <Typography>Yes</Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                )}
                {(!postUser && !isAdmin) && (
                    <React.Fragment>
                        <Button onClick={handleClickOpen}
                                sx={{backgroundColor: red[300], margin: "5px", '&:hover': {backgroundColor: red[400]}}}
                                variant="filledTonal">
                            <Typography>Report</Typography>
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Do you confirm that you want to mark the post?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    are you sure?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    <Typography>No</Typography>
                                </Button>
                                <Button onClick={reportPost()}>
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

                {deletionStatus.message && (
                    <Alert variant={deletionStatus.variant}>
                        {deletionStatus.message}
                    </Alert>
                )}
                {submitStatus.message && (
                            <Alert variant={submitStatus.variant}>
                                {submitStatus.message}
                            </Alert>
                )}
            </Grid>
        </Paper>
    );
}

export default PostDetails;