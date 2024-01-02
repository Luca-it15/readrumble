import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

function GoRegister() {
    console.log("ciaooo");
    window.location.href="http://localhost:3000/registration"
}

function LoginForm() {
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
    const { name, value, type, checked } = e.target;
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
      // Invia la richiesta HTTP qui usando axios
      const response = await axios.post('http://localhost:8080/api/login', formData);

      // Gestisci la risposta qui
      setLoginStatus({ message: response.data, variant: 'success' });

      // Attendere 3 secondi e poi reindirizzare
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/';
      }, 3000); // 3000 millisecondi = 3 secondi
    } catch (error) {
      // Gestisci gli errori qui
      setLoginStatus({ message: error.response ? error.response.data : error.message, variant: 'danger' });
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" placeholder="Username" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Button onClick={GoRegister}>
       Register
      </Button>

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
  );
}

export default LoginForm;