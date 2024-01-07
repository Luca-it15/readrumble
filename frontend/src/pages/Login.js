import React, {useState} from 'react';
import {TextField, Button, Alert, Container, Box} from '@mui/material';
import axios from 'axios';
import '../App.css';
import { Navigate } from 'react-router-dom';

function GoRegister() {
    console.log("ciaooo");
    return <Navigate to="/registration" />;
}

function LoginForm() {
    const [redirect, setRedirect] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
    });

    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione: Verifica se almeno un campo è vuoto
        if (Object.values(formData).some((value) => value === '')) {
            setValidationError('All fields must be filled !');
            return;
        }

        try {
            console.log(formData);
            // Invia la richiesta HTTP qui usando axios
            const response = await axios.post('http://localhost:8080/api/login', formData);
            const retrieve = await axios.post('http://localhost:8080/api/personalinfo', formData);
            // Gestisci la risposta qui

            console.log(response.data);
            setLoginStatus({message: response.data, variant: 'success'});
            // Imposta il flag di login nello stato e in localStorage
            const isLoggedIn = true;
            setLoginStatus(true);
            localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
            localStorage.setItem('logged_user', JSON.stringify(retrieve.data));

            // Attendere 1 secondo e poi reindirizzare
            setTimeout(function () {
                setRedirect(true);
            }, 1000)
        } catch (error) {
            // Gestisci gli errori qui
            setLoginStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});
        }
    };

    return (
        <Container className="LoginDiv">
            {redirect && <Navigate to="/dashboard" />}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                <TextField margin="normal" required fullWidth id="username" label="Username" name="username"
                           autoComplete="username" autoFocus onChange={handleChange} />
                <TextField margin="normal" required fullWidth name="password" label="Password" type="password"
                           id="password" autoComplete="current-password" onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="success" size="small">
                    Submit
                </Button>
            </Box>
            <Button className="buttonlogreg" onClick={GoRegister} variant="contained" color="secondary" size="small">
                Register
            </Button>

            {validationError && (
                <Alert severity="error">
                    {validationError}
                </Alert>
            )}

            {loginStatus.message && (
                <Alert severity={loginStatus.variant}>
                    {loginStatus.message}
                </Alert>
            )}
        </Container>
    );
}

export default LoginForm;
