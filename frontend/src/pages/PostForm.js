import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import {Container, Row, Col, Alert} from 'react-bootstrap';
import RatingStars from '../components/RatingStars';
import axios from 'axios';
import BookSelector from '../components/BookSelector';
import { ArrowDropDown } from '@mui/icons-material';
import { Typography} from '@mui/material';
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
        tags: [], 
        bookmark: 0, 
        pages_read: 0
    });
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        let num_pages = 0; 
        if(name === 'bookmark') {
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
            console.log("i post degli utenti sono: + "); 
            for(var post in arrayPostJson) {
                console.log(post); 
            }
        
            if(arrayPostJson != null) {

             
                    console.log("i post degli utenti sono: + "); 
                    for(var post in arrayPostJson) {
                        console.log(post); 
                    }
                
                
                
                console.log(arrayPostJson); 
                let arrayPost = JSON.parse(arrayPostJson);
                

             console.log(formData); 
             arrayPost.push(formData);
             console.log("ho inserito un nuovo post: " + formData);
             console.log("i post sono: " + arrayPost); 
             
             arrayPost.sort((a, b) => {
                if (a.date_added < b.date_added) {
                    return 1;
                }
                if (a.date_added > b.date_added) {
                    return -1;
                }
                return 0;
             });
  
             let arrayPostUpdate = JSON.stringify(arrayPost);
             localStorage.setItem('last_posts', arrayPostUpdate);
            } else {
                let arrayPost = [formData];

               let arrayPostJson = JSON.stringify(arrayPost);
               console.log(arrayPostJson); 

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
            setLoginStatus({message: error.response ? JSON.stringify(error.response.data) : error.message, variant: 'danger'});
            timeout_text_error()
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <div className="flex justify-center items-center h-screen">
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-3xl font-bold text-center mb-4">Create a Review</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-center items-center h-screen text-center">
                                    <div className="space-y-1">
                                        <label className="label">Review Title</label>
                                        <p>Choose the title of book</p>
                                     <BookSelector handleChangeBookTitle={handleChangeBookTitle} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Number of pages read</label>
                                        <input
                                            type="number"
                                            id="bookmark"
                                            name="bookmark"
                                            min="0"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Your Review</label>
                                        <TextareaAutosize
                                            id="review_text"
                                            name="review_text"
                                            aria-label="minimum height"
                                            minRows={3}
                                            placeholder="Your review"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Rating</label>
                                        <RatingStars onChange={handleChangeRating} readOnly={false} isStatic={false} stars={0}/>
                                    </div>
                                    <div className="flex justify-center mt-3 mb-5">
                                    <Button sx={{backgroundColor: blue[200], height: "40px", '&:hover': {backgroundColor: '#23d984'}}}
                                variant="filledTonal" type='submit'
                                startIcon={<ArrowDropDown sx={{color: blue[700]}}/>}>
                            <Typography>Invia!</Typography>
                        </Button>
                                    </div>
                                </div>
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
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

