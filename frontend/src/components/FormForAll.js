import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';

const FormForAll = (prop) => {
    console.log("FormForAll")
  console.log(prop)
  const [formData, setFormData] = useState({

    old_field: '',
    new_field: ''

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
    console.log(formData);
      // Invia la richiesta HTTP qui usando axios
      const response = await axios.post('http://localhost:8080/api/change', formData);
      // Gestisci la risposta qui

      setLoginStatus({ message: response.data, variant: 'success' });

    } catch (error) {
      // Gestisci gli errori qui
      setLoginStatus({ message: error.response ? error.response.data : error.message, variant: 'danger' });
    }
  };

  return (
    <div className ="LoginDiv">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name={prop.old_field} placeholder={prop.old_field} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="text" name={prop.new_field} placeholder={prop.new_field} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

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

export default FormForAll;