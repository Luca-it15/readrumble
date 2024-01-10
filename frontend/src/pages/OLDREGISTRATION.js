import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import axios from 'axios';

function RegistrationForm() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        username: '',
        password: '',
        checked: false,
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

        try {
            // Invia la richiesta HTTP qui usando axios
            const response = await axios.post('http://localhost:8080/api/registration', formData);

            // Verifica che 'response' e 'response.data' siano definiti prima di utilizzarli
            if (response && response.data) {
                // Gestisci la risposta qui (puoi aggiungere log o altri handling)
                console.log(response.data);
            } else {
                console.error('Risposta non valida:', response);
            }
        } catch (error) {
            // Gestisci gli errori qui (puoi aggiungere log o altri handling)
            console.error('Errore durante la registrazione:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange}/>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Name" onChange={handleChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicSurname">
                <Form.Label>Surname</Form.Label>
                <Form.Control type="text" name="surname" placeholder="Surname" onChange={handleChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" placeholder="Username" onChange={handleChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" name="checked" onChange={handleChange}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default RegistrationForm;
