import React, { useState } from 'react';
import Profile from '../components/Profile';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form, Button, Alert } from 'react-bootstrap';
import '../App.css';
import FormForAll from '../components/FormForAll';
import { BrowserRouter, Route, Routes, Navigate, redirect} from 'react-router-dom';

var storedData = localStorage.getItem('logged_user');
console.log(storedData)
// Verifica se il valore è presente
if (storedData) {
  // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
  var user = JSON.parse(storedData);

  // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
  console.log(user["name"]);
} else {
  // La chiave 'isLoggedIn' non è presente in localStorage
  console.log('La chiave "logged_user" non è presente in localStorage.');
}
//<Button onClick={setChangeUser(true)}>Cambia Username</Button>}
const UserSettings = () => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <Container fluid>
        <Row>
            <Button onClick={handleButtonClick}>
            {showForm ? 'Nascondi Form' : 'Mostra Form'}
            </Button>
            {showForm && <FormForAll value={user} />}
        </Row>
        <Row>
            <h1>Ciao 2 !</h1>
        </Row>
    </Container>
  );
};
export default UserSettings;