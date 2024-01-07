import React, { useState } from 'react';
import Profile from '../components/Profile';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form, Button, Alert } from 'react-bootstrap';
import '../App.css';
import FormForAll from '../components/FormForAll';
import { BrowserRouter, Route, Routes, Navigate, redirect} from 'react-router-dom';

function goProfile()
{
    window.location.href='http://localhost:3000/profile';
}
var storedData = localStorage.getItem('logged_user');
console.log("ecco la storedData " + storedData)
// Verifica se il valore è presente
if (storedData) {
  // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
  var user = JSON.parse(storedData);

  // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
  console.log("ecco il nome da user['Name'] " + user["Name"]);
} else {
  // La chiave 'isLoggedIn' non è presente in localStorage
  console.log('La chiave "logged_user" non è presente in localStorage.');
}
//<Button onClick={setChangeUser(true)}>Cambia Username</Button>}
const UserSettings = () => {
  const [showForm1, setShowForm1] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [showForm3, setShowForm3] = useState(false);
  const [showForm4, setShowForm4] = useState(false);
    const handleButtonClick1 = () => {
        setShowForm1(!showForm1);
    };
    const handleButtonClick2 = () => {
        setShowForm2(!showForm2);
    };
    const handleButtonClick3 = () => {
        setShowForm3(!showForm3);
    };
    const handleButtonClick4 = () => {
        setShowForm4(!showForm4);
    };
   var obj1 = {"name":"Username","Username":user["Username"]};
   var obj2 = {"name":"Name","Username":user["Username"]};
   var obj3 = {"name":"Surname","Username":user["Username"]};
   var obj4 = {"name":"Password","Username":user["Username"]};

  return (
    <Container fluid>
        <Row>
            <Button className="style_of_the_button_unpressed" onClick={handleButtonClick1}>
            {showForm1 ? 'Close Form' : 'Change Username'}
            </Button>

        </Row>
        <Row>
            {showForm1 && <FormForAll prop={obj1} />}
        </Row>
        <Row>
            <Button className="style_of_the_button_unpressed" onClick={handleButtonClick2}>
            {showForm2 ? 'Close Form' : 'Change Name'}
            </Button>

        </Row>
        <Row>
            {showForm2 && <FormForAll prop={obj2} />}
        </Row>
        <Row>
            <Button className="style_of_the_button_unpressed" onClick={handleButtonClick3}>
            {showForm3 ? 'Close Form' : 'Change Surname'}
            </Button>

        </Row>
        <Row>
            {showForm3 && <FormForAll prop={obj3} />}
        </Row>
        <Row>
            <Button className="style_of_the_button_unpressed" onClick={handleButtonClick4}>
            {showForm4 ? 'Close Form' : 'Change Password'}
            </Button>

        </Row>
        <Row>
            {showForm4 && <FormForAll prop={obj4} />}
        </Row>
        <Row>
            <Button className="style_of_the_button" onClick={goProfile}>Back to Profile</Button>
        </Row>
    </Container>
  );
};
export default UserSettings;