import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';

const FormForAll = ({prop}) => {
    //pulisce l'area degli alert
    function timeout_text()
    {
        setTimeout(function() {
                  // Azione da compiere dopo 1 secondo
                  setLoginStatus({message:'',variant:'success'});
                  setValidationError('');
                }, 1500)
    }

  const [formData, setFormData] = useState({

    old_field: '',
    new_field: '',
    type_of_change_request: prop.name,
    username_to_use: prop.Username,

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
        timeout_text()
      return;
    }


    if(formData.type_of_change_request === "Username" && formData.old_field !== formData.username_to_use )
    {
        setValidationError('Current Usernames do not correspond');
        timeout_text();
        return;
    }
    try {
    console.log(formData);

      // Invia la richiesta HTTP qui usando axios

      const response = await axios.post('http://localhost:8080/api/change', formData);
      // Gestisci la risposta qui

      setLoginStatus({ message: response.data, variant: 'success' });
      timeout_text()
        var storedData = localStorage.getItem('logged_user');

        // Verifica se il valore è presente
        if (storedData) {
          // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
          var user = JSON.parse(storedData);

          // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
          user[prop.name] = formData.new_field
          localStorage.setItem('logged_user', JSON.stringify(user));
        } else {
          // La chiave 'isLoggedIn' non è presente in localStorage
          console.log('La chiave "logged_user" non è presente in localStorage.');
        }
    } catch (error) {
      // Gestisci gli errori qui
      setLoginStatus({ message: error.response ? error.response.data : error.message, variant: 'danger' });
      timeout_text()
    }
  };

  return (
    <div className ="LoginDiv">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>{"Old " + prop.name}</Form.Label>
          <Form.Control type="text" name="old_field" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>{"New " + prop.name}</Form.Label>
          <Form.Control type="text" name="new_field" onChange={handleChange} />
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