import React from 'react';
import Profile from '../components/Profile';
<<<<<<< HEAD
//<<<<<<< HEAD
import UserSettings from './UserSettings';
//=======
import BookList from './BookList';
//>>>>>>> 47b176210639ec7a2894b7b2519420d3e31f7e97
=======
// <<<<<<< HEAD
import UserSettings from './UserSettings';
// =======
import BookList from './BookList';
// >>>>>>> 47b176210639ec7a2894b7b2519420d3e31f7e97
>>>>>>> 7f5109848bc7229196d13b1674a771d16953dd26
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import '../App.css'
import { BrowserRouter, Route, Routes, Navigate, redirect} from 'react-router-dom';
var storedData = localStorage.getItem('logged_user');

// Verifica se il valore è presente
if (storedData) {
  // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
  var user = JSON.parse(storedData);

  // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
  console.log(user["Name"]);
} else {
  // La chiave 'isLoggedIn' non è presente in localStorage
  console.log('La chiave "logged_user" non è presente in localStorage.');
}
function goSettings()
{
    return window.location.href= "http://localhost:3000/settings";
}
const ProfilePage = () => {
  return (
    <Container fluid>
        <Row>
            <Col>
                <Profile {...user} />
            </Col>
            <Col>
                <Button onClick={goSettings}>CIAO</Button>
            </Col>
        </Row>

        <Row>
            <Col>
                <Row>
                    <h1>Amici</h1>
                </Row>
                <Row>
                    <h1>Competizioni</h1>
                </Row>
            </Col>
            <Col>

                <h2>Post</h2>
            </Col>
            <Col>
                <Row>
                    <h1>Libri Preferiti</h1>
                </Row>
                <Row>
                    <h1>Libri Letti</h1>
                    <p>10 libri a caso:</p>
                    <BookList />
                </Row>
            </Col>
        </Row>
    </Container>
  );
}

export default ProfilePage;
