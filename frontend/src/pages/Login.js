import React, {useState} from 'react';
import {Alert, Form} from 'react-bootstrap';
import axios from 'axios';
import '../App.css';
import {useNavigate} from 'react-router-dom';
import {Grid, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material-next/Button";
import {blue, green} from "@mui/material/colors";


function LoginForm() {
    const navigate = useNavigate();
    const GoRegister = () =>
    {
        navigate('/registration');
    }

    const [formData, setFormData] = useState({
        _id: '',
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

    async function fetchAll(id) {
        const currentUser = JSON.parse(localStorage.getItem('logged_user'));

        console.log("Fetching currently reading books " + id);
        // Fetch currently reading books
        const fetchedCurrentlyReadingBooks = await axios.get(`http://localhost:8080/api/book/currentlyReadingBooks/${id}`)
        const currentlyReadingBooks = JSON.parse(JSON.stringify(fetchedCurrentlyReadingBooks.data));

        if (currentlyReadingBooks) {
            currentUser['currentlyReading'] = currentlyReadingBooks.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            }));
            console.log(currentlyReadingBooks);
        } else {
            currentUser['currentlyReading'] = [];
        }

        console.log("Fetching read books " + id);
        // Fetch recently read books
        const fetchedRecentBooks = await axios.get(`http://localhost:8080/api/book/recentlyReadBooks/${id}`)
        const recentlyReadBooks = JSON.parse(JSON.stringify(fetchedRecentBooks.data));

        if (recentlyReadBooks) {
            currentUser['recentlyReadBooks'] = recentlyReadBooks.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, '')
            }));
            console.log(recentlyReadBooks);
        } else {
            currentUser['recentlyReadBooks'] = [];
        }

        console.log("Fetching favorite books " + id);
        // Fetch favorite books
        const fetchedFavoriteBooks = await axios.get(`http://localhost:8080/api/favoriteBooks/${id}`)
        const favoriteBooks = JSON.parse(JSON.stringify(fetchedFavoriteBooks.data));

        if (favoriteBooks) {
            currentUser['favoriteBooks'] = favoriteBooks.map(book => ({
                id: book.id.replace(/"/g, ''),
                title: book.title.replace(/"/g, '')
            }));
            console.log(favoriteBooks);
        } else {
            currentUser['favoriteBooks'] = [];
        }

        console.log("Fetching following list " + id);
        // Fetch following list
        const fetchedFollowingList = await axios.get(`http://localhost:8080/api/following/${id}`)
        if (fetchedFollowingList.data) {
            currentUser['following'] = JSON.parse(JSON.stringify(fetchedFollowingList.data))
            console.log(fetchedFollowingList.data);
        } else {
            currentUser['following'] = [];
        }

        localStorage.setItem('logged_user', JSON.stringify(currentUser));

        console.log(JSON.parse(localStorage.getItem('logged_user')));

        // Attendere 1 secondo e poi reindirizzare
        setTimeout(function () {
            window.location.href="/dashboard"
            navigate("/dashboard");
        }, 1000)
    }

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
            // Gestisci la risposta qui

            console.log(response.data);
            if(response.data === '')
            {
                setLoginStatus({message: "Username or Password are incorrect", variant: 'danger'});
            }
            else
            {
                setLoginStatus({message: "You Logged in Successfully, you will now be redirected to your home ", variant: 'success'});
                const isLoggedIn = true;
                setLoginStatus(true);
                var isAdmin = false
                if(response.data.isAdmin == 1)
                {
                    isAdmin = true;
                }
                localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
                localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
                localStorage.setItem('logged_user', JSON.stringify(response.data));

                fetchAll(response.data._id);
            }
            // Imposta il flag di login nello stato e in localStorage
        } catch (error) {
            // Gestisci gli errori qui
            setLoginStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});
        }
    };

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '30px 50px 30px 50px',
        margin: '10px',
        borderRadius: 10,
        width: '40%'
    }

    return (
        <Paper sx={PaperStyle}>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Username</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="text" name="_id" placeholder="Username" onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Password</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="password" name="password" placeholder="Password" onChange={handleChange}/>
                </Form.Group>
                <Grid item sx={{textAlign: 'center', marginBottom: '70px'}}>
                    <Button variant="filled" type="submit" sx={{backgroundColor: blue[400], '&:hover': {backgroundColor: green[400]}}}>
                        <Typography>Login</Typography>
                    </Button>
                </Grid>
            </Form>
            <Grid item sx={{textAlign: 'right'}}>
                <Typography>Don't have an account?
                <Button variant="filled" onClick={GoRegister} sx={{marginLeft: '20px', backgroundColor: blue[700], '&:hover': {backgroundColor: blue[400]}}}>
                    <Typography>Register</Typography>
                </Button></Typography>
            </Grid>

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
        </Paper>
    );
}

export default LoginForm;