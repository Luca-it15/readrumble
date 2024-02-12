import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material-next/Button';
import {Alert, Container} from 'react-bootstrap';
import RatingStars from '../components/RatingStars';
import axios from 'axios';
import BookSelector from '../components/BookSelector';
import IosShareTwoToneIcon from '@mui/icons-material/IosShareTwoTone';
import {Grid, Paper, Typography, FormControlLabel, Checkbox} from '@mui/material';
import {blue} from "@mui/material/colors";
import { useNavigate } from 'react-router-dom';
import GoBack from '../components/GoBack';

export default function PostForm() {

    const navigate = useNavigate(); 

    let currentUser = localStorage.getItem('logged_user');
   
    if (currentUser) {
      
        currentUser = JSON.parse(currentUser);
    } else {
        
        console.log('logged_user key is not present in the localstorage');
    }

    function timeout_text() {
        setTimeout(function () {
            navigate(-1);
        }, 6000)
    }

    function timeout_text_error() {
        setTimeout(function () {
            navigate(-1);
        }, 6000)
    }

    const [submitStatus, setSubmitStatus] = useState({
        message: '',
        variant: 'success', 
    });

    const [validationError, setValidationError] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [book_id, setBook_id] = useState([]);
    const [tags, setTags] = useState([]);
    const [old_bookmark, setOldBookmark] = useState(0);
    const [checked, setChecked] = useState(false); 


    const [formData, setFormData] = useState({
        _id: 0,
        book_id: '',
        rating: 0,
        review_text: '',
        date_added: ' ',
        book_title: '',
        username: currentUser['_id'],
        tag: [],
        bookmark: 0,
        pages_read: 0,
        competitions_name: [],
        competitions_tag: []
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        let book = currentUser['currentlyReading'];

        book = book.filter(book => book.title === selectedTitle);

        let num_pages = book['bookmark'];
        
        if (name === 'bookmark') {
            num_pages = parseInt(value) - parseInt(old_bookmark);
            setFormData({
                ...formData,
                ['pages_read']: num_pages,
                ['bookmark']: parseInt(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleChangeBookTitle = (selectedTitle, selectedBook_id, selectedTags, selectedBookmark) => {
        setSelectedTitle(selectedTitle);
        setBook_id(selectedBook_id);
        setOldBookmark(parseInt(selectedBookmark));
       
        setTags(selectedTags);
        setFormData({
            ...formData,
            book_title: selectedTitle,
            book_id: selectedBook_id,
            tag: selectedTags
        });
    }

    const handleChangeRating = (newRating) => {
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        setFormData({
            ...formData,
            rating: newRating,
            date_added: isoString
        });
    };

    const handleNotRating = (event) => {
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        setChecked(event.target.checked);
        setFormData({
            ...formData,
            rating: 0,
            date_added: isoString,
            review_text: " "
        });
      };


    const handleSubmit = async (e) => {
        e.preventDefault();

      
        if (Object.values(formData).some((value) => value === '')) {
            setSubmitStatus({
                message: 'All fields must be filled!',
                variant: 'danger'
            });
            return; 
            
        }
        
        if(formData.pages_read < 0) {
            setSubmitStatus({
                message: 'New bookmark must be great than the previous bookmark',
                variant: 'danger'
            });
            return
        }


        try {
            let arrayPostJson = localStorage.getItem('last_posts');
            if (arrayPostJson != null) {
                let arrayPost = JSON.parse(arrayPostJson);

                arrayPost.unshift(formData);

                let arrayPostUpdate = JSON.stringify(arrayPost);
                localStorage.setItem('last_posts', arrayPostUpdate);
            } else {
                let arrayPost = [formData];

                let arrayPostJson = JSON.stringify(arrayPost);
                console.log(arrayPostJson);

                localStorage.setItem('last_posts', arrayPostJson);
            }

            let currentUser = JSON.parse(localStorage.getItem('logged_user'));
            let competitions = currentUser['competitions'];

    
            if (competitions) {

                let competitions_name = Array();
                let competitions_tag = Array();
                formData.tag.forEach(tag => {
                    let i = 0;

                    while (competitions[i] != null) {
                        if (competitions[i].tag.toUpperCase() === tag.toUpperCase()) {
                            competitions[i].pages = parseInt(competitions[i].pages) + parseInt(formData.pages_read);
                            competitions_name.push(competitions[i].name);
                            competitions_tag.push(competitions[i].tag);
                        }
                        console.log("we have add " + formData.pages_read + " new pages read a the competition of " + tag);
                        i++;
                    }
                });

                formData.competitions_name = competitions_name;
                formData.competitions_tag = competitions_tag;
                currentUser['competitions'] = competitions;
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
            }

            const response = await axios.post('http://localhost:8080/api/post/submit', formData);
           

            // Update the user's currently reading book
            let books = currentUser['currentlyReading'];

            books.forEach(book => {
                if (book.title === selectedTitle) {
                    book.bookmark = formData.bookmark;
                }
            })
            currentUser['currentlyReading'] = books;
            localStorage.setItem('logged_user', JSON.stringify(currentUser));

            console.log('Post successfully uploaded!');
            setSubmitStatus({
                message: JSON.stringify(response.data),
                variant: 'success'
            });
            timeout_text(); 
            
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus({
                message: error.response ? JSON.stringify(error.response.data) : error.message,
                variant: 'danger'
            });
            timeout_text_error(); 
        }
    };

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%'
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="column" justifyContent="center">
                    <Grid item xs={12}>
                        <GoBack />
                        <Typography variant="h4" textAlign="center" sx={{marginBottom: '30px'}}>Create a
                            post</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container direction="column" alignItems="center" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" textAlign="center">Choose the book to review</Typography>
                                    <BookSelector handleChangeBookTitle={handleChangeBookTitle}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" textAlign="center">Bookmark</Typography>
                                    <TextField
                                        type="number"
                                        id="bookmark"
                                        name="bookmark"
                                        inputProps={{min: "0"}}
                                        required
                                        onChange={handleChange}
                                        sx={{
                                            backgroundColor: '#fff', borderRadius: 18,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: 18,
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={handleNotRating}
                                            name={"updatePages"}
                                        />
                                    }
                                    label={"I just want to update the number of pages "}
                                />
                                </Grid>
                                {!checked && (
                                 <>
                                <Grid item xs={12}>
                                    <Typography variant="h6" textAlign="center">Your review</Typography>
                                    <TextField
                                        id="review_text"
                                        name="review_text"
                                        multiline
                                        rows={3}
                                        placeholder="Your review"
                                        required
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff', borderRadius: 6,
                                            width: '800px',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: 6,
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" textAlign="center">Rating</Typography>
                                    <RatingStars onChange={handleChangeRating} readOnly={false} isStatic={false}
                                                />
                                </Grid>
                                </>
                                )}
                                <Grid item xs={12}>
                                    <Button sx={{
                                        backgroundColor: blue[200],
                                        height: "40px",
                                        '&:hover': {backgroundColor: '#23d984'}
                                    }}
                                            variant="filledTonal" type='submit'
                                            startIcon={<IosShareTwoToneIcon sx={{color: blue[700]}}/>}>
                                        <Typography>Submit</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                        {validationError && (
                            <Alert variant="danger">
                                {validationError}
                            </Alert>
                        )}

                        {submitStatus.message && (
                            <Alert variant={submitStatus.variant}>
                                {submitStatus.message}
                            </Alert>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

