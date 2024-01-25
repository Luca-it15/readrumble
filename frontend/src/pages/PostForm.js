import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material-next/Button';
import {Container, Alert} from 'react-bootstrap';
import RatingStars from '../components/RatingStars';
import axios from 'axios';
import BookSelector from '../components/BookSelector';
import IosShareTwoToneIcon from '@mui/icons-material/IosShareTwoTone';
import {Grid, Paper, Typography} from '@mui/material';
import {blue} from "@mui/material/colors";

export default function PostForm() {

    let currentUser = localStorage.getItem('logged_user');
    // Verifica se il valore è presente
    if (currentUser) {
        // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
        currentUser = JSON.parse(currentUser);
    } else {
        // La chiave 'isLoggedIn' non è presente in localStorage
        console.log('La chiave "logged_user" non è presente in localStorage.');
    }

    function timeout_text() {
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setLoginStatus({message: '', variant: 'success'});
            return window.location.href = "http://localhost:3000/profile";
        }, 12000)
    }

    function timeout_text_error() {
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setLoginStatus({message: '', variant: 'error'});
            return window.location.href = "http://localhost:3000/profile";
        }, 24000)
    }

    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
    });

    const [validationError, setValidationError] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [book_id, setBook_id] = useState([]);
    const [tags, setTags] = useState([]);
    const [old_bookmark, setOldBookmark] = useState(0);

    const [formData, setFormData] = useState({
        _id: 0,
        book_id: '',
        rating: 0,
        review_text: '',
        date_added: ' ',
        book_title: '',
        username: currentUser['_id'],
        bookmark: 0,
        pages_read: 0
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        let num_pages = 0;
        if (name === 'bookmark') {
            num_pages = value - parseInt(old_bookmark);
            setFormData({
                ...formData,
                ['pages_read']: num_pages,
                ['bookmark']: parseInt(value)
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
            tags: selectedTags
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione: Verifica se almeno un campo è vuoto
        if (Object.values(formData).some((value) => value === '')) {
            setValidationError('All fields must be filled !');
            //timeout_text()
            return;
        }

        try {
            let arrayPostJson = localStorage.getItem('last_posts');
            if (arrayPostJson != null) {
                let arrayPost = JSON.parse(arrayPostJson);

                arrayPost.push(formData);

                let arrayPostUpdate = JSON.stringify(arrayPost);
                localStorage.setItem('last_post', arrayPostUpdate);
            } else {
                let arrayPost = [formData];

                let arrayPostJson = JSON.stringify(arrayPost);

                localStorage.setItem('last_posts', arrayPostJson);
            }
            // Invia i dati al server usando Axios
            const response = await axios.post('http://localhost:8080/api/post/submit', formData);
            setLoginStatus({message: response.data, variant: 'success'});
            timeout_text()
            // Esegui altre azioni dopo la submit se necessario
            console.log('Recensione inviata con successo!');
        } catch (error) {
            console.error('Errore durante l\'invio della recensione:', error);
            setLoginStatus({
                message: error.response ? JSON.stringify(error.response.data) : error.message,
                variant: 'danger'
            });
            timeout_text_error()
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
                        <Typography variant="h4" textAlign="center" sx={{marginBottom: '30px'}}>Create a post</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container direction="column" alignItems="center" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" textAlign="center">Choose the book to review</Typography>
                                    <BookSelector handleChangeBookTitle={handleChangeBookTitle}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" textAlign="center">Number of pages read</Typography>
                                    <TextField
                                        type="number"
                                        id="bookmark"
                                        name="bookmark"
                                        inputProps={{ min: "0" }}
                                        required
                                        onChange={handleChange}
                                        sx={{backgroundColor: '#fff', borderRadius: 18,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: 18,
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
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
                                        sx={{backgroundColor: '#fff', borderRadius: 6,
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
                                    <RatingStars onChange={handleChangeRating} readOnly={false} isStatic={false} stars={0}/>
                                </Grid>
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

                        {loginStatus.message && (
                            <Alert variant={loginStatus.variant}>
                                {loginStatus.message}
                            </Alert>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

