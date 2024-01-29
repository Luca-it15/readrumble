import React, {useState} from 'react';
import {Form, Alert} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Paper, Grid, Typography} from "@mui/material";
import {blue, green} from "@mui/material/colors";
import Button from "@mui/material-next/Button"
import Logo from "../img/logoRR.png";

function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        _id: '',
        password: '',
    });
    const [registrationStatus, setRegistrationStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
    });
    const [validationError, setValidationError] = useState('');

    function timeout_text() {
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setRegistrationStatus({message: '', variant: 'success'});
            setValidationError('');
        }, 1500)
    }

    const GoLogin = () => {
        navigate('/login');
    }

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
            timeout_text();
            return;
        }
        console.log(formData);
        try {
            const response = await axios.post('http://localhost:8080/api/registration', formData);

            setRegistrationStatus({message: response.data, variant: 'success'});

            timeout_text();

            let currentUser = localStorage.getItem('logged_user');

            if (!currentUser) {
                currentUser = {};
            } else {
                currentUser = JSON.parse(currentUser);
            }

            currentUser['_id'] = formData['_id'];
            currentUser['name'] = formData['name'];
            currentUser['surname'] = formData['surname'];

            localStorage.setItem('logged_user', JSON.stringify(currentUser));
            localStorage.setItem('isLoggedIn', 'true');

            window.location.href = '/home';
        } catch (error) {
            setRegistrationStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});
            timeout_text();
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
            <Grid item sx={{textAlign: 'center', marginBottom: '30px'}}>
                <img src={Logo} alt="logo"/>
            </Grid>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Name</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="text" name="name"
                                  placeholder="Name" onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Surname</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="text" name="surname"
                                  placeholder="Surname" onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Username</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="text" name="_id"
                                  placeholder="Username" onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{marginLeft: '10px'}}><Typography>Password</Typography></Form.Label>
                    <Form.Control style={{borderRadius: '30px', marginBottom: '30px'}} type="password" name="password"
                                  placeholder="Password" onChange={handleChange}/>
                </Form.Group>

                <Grid item sx={{textAlign: 'center', marginBottom: '70px'}}>
                    <Button variant="filled" type="submit"
                            sx={{backgroundColor: blue[400], '&:hover': {backgroundColor: green[400]}}}>
                        <Typography>Register</Typography>
                    </Button>
                </Grid>
            </Form>

            <Grid item sx={{textAlign: 'right'}}>
                <Typography>Already have an account?
                    <Button onClick={GoLogin} variant="filled" type="submit" sx={{
                        marginLeft: '20px',
                        backgroundColor: blue[700],
                        '&:hover': {backgroundColor: blue[400]}
                    }}>
                        <Typography>Login</Typography>
                    </Button>
                </Typography>
            </Grid>

            {validationError && (
                <Alert variant="danger">
                    {validationError}
                </Alert>
            )}

            {registrationStatus.message && (
                <Alert variant={registrationStatus.variant}>
                    {registrationStatus.message}
                </Alert>
            )}
        </Paper>
    );
}

export default RegistrationForm;
