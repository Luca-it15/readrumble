import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import {Container, Row, Col, Alert} from 'react-bootstrap';
import RatingStars from '../components/RatingStars';
import axios from 'axios';

export default function ReviewForm() {

    var storedData = localStorage.getItem('logged_user');

    if (storedData) {
        // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
        var user = JSON.parse(storedData);

        // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
        console.log(user["Name"]);
    } else {
        // La chiave 'isLoggedIn' non è presente in localStorage
        console.log('La chiave "logged_user" non è presente in localStorage.');
    }

    function timeout_text() {
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setLoginStatus({message: '', variant: 'success'});
            return window.location.href = "http://localhost:3000/profile";
        }, 2000)
    }

    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
    });

    const [validationError, setValidationError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        username: user.Username,
        numberOfPagesRead: 0,
        review: '',
        rating: 0,
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeRating = (newRating) => {
        setFormData({
            ...formData,
            rating: newRating,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione: Verifica se almeno un campo è vuoto
        if (Object.values(formData).some((value) => value === '')) {
            setValidationError('All fields must be filled !');
            timeout_text()
            return;
        }

        try {
            // Invia i dati al server usando Axios
            const response = await axios.post('http://localhost:8080/api/review', formData);
            setLoginStatus({message: response.data, variant: 'success'});
            timeout_text()
            // Esegui altre azioni dopo la submit se necessario
            console.log('Recensione inviata con successo!');
        } catch (error) {
            console.error('Errore durante l\'invio della recensione:', error);
            setLoginStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});
            timeout_text()
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
                                        <TextField
                                            id="title"
                                            name="title"
                                            label="Title"
                                            variant="standard"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Number of pages read</label>
                                        <input
                                            type="number"
                                            id="numberOfPagesRead"
                                            name="numberOfPagesRead"
                                            min="0"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Your Review</label>
                                        <TextareaAutosize
                                            id="review"
                                            name="review"
                                            aria-label="minimum height"
                                            minRows={3}
                                            placeholder="Your review"
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Rating</label>
                                        <RatingStars onChange={handleChangeRating} readOnly={false}/>
                                    </div>
                                    <div className="flex justify-center mt-3 mb-5">
                                        <Button
                                            className="w-full md:w-auto bg-blue-500 text-white dark:text-gray-200 rounded-full border-2 border-blue-500"
                                            variant="contained"
                                            type="submit"
                                        >
                                            Submit Review
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

