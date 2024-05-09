import React, {useState} from 'react';
import {Alert, Form} from 'react-bootstrap';
import axios from 'axios';
import '../App.css';
import {useNavigate} from 'react-router-dom';
import {Grid, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material-next/Button";
import {blue, green} from "@mui/material/colors";
import CircularProgress from '@mui/material/CircularProgress';
import Logo from "../img/logoRR.png";

function LoginForm() {
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const register = () => {
        navigate('/registration');
    }

    const [formData, setFormData] = useState({
        _id: '',
        password: ''
    });

    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success'
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(formData).some((value) => value === '')) {
            setValidationError('All fields must be filled!');
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post('http://localhost:8080/api/login', formData);

            if (response.data === 'error') {
                setLoginStatus({message: response.data, variant: 'danger'});
                setIsLoading(false);
            } else {
                setLoginStatus(true);

                // Get only id, name and surname from the response
                const currentUser = {
                    _id: response.data._id,
                    name: response.data.name,
                    surname: response.data.surname
                }

                localStorage.setItem('logged_user', JSON.stringify(currentUser));

                if (response.data.isAdmin == 1) {
                    localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin == 1));
                    window.location.href = "/home"
                } else if((response.data.isBanned == 1)) {
                    setLoginStatus({
                        message: "You are Banned from the service",
                        variant: 'danger'
                    });

                    setIsLoading(false);
                    return;
                }

                const isLoggedIn = true;
                localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));

                window.location.href = "/home"
            }
        } catch (error) {
            setLoginStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});

            setIsLoading(false);
        }
    };

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '30px 50px 30px 50px',
        margin: '7vh 0px 10vh 0px',
        borderRadius: 10,
        width: '40%'
    }

    return (
        <Paper sx={PaperStyle}>
            <Grid item sx={{textAlign: 'center', marginBottom: '30px'}}>
                <img src={Logo} alt="logo"/>
            </Grid>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Username</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="text" name="_id"
                                  placeholder="Username" onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Password</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="password" name="password"
                                  placeholder="Password" onChange={handleChange}/>
                </Form.Group>
                <Grid item sx={{textAlign: 'center', marginBottom: '70px'}}>
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

                    <Button variant="filled" type="submit"
                            sx={{backgroundColor: blue[400], '&:hover': {backgroundColor: green[400]}}}>
                        {isLoading ? <CircularProgress color="inherit" size={24}/> : <Typography>Login</Typography>}
                    </Button>
                </Grid>
            </Form>

            <Grid item sx={{textAlign: 'right'}}>
                <Typography>Don't have an account?
                    <Button variant="filled" onClick={register} sx={{
                        marginLeft: '20px',
                        backgroundColor: blue[700],
                        '&:hover': {backgroundColor: blue[400]}
                    }}>
                        <Typography>Register</Typography>
                    </Button></Typography>
            </Grid>

        </Paper>
    );
}

export default LoginForm;