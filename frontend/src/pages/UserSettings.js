import React, {useState} from 'react';
import {Container, Grid, Button, Alert, Box, ToggleButton, ToggleButtonGroup} from '@mui/material';
import '../App.css';
import FormForAll from '../components/FormForAll';
import {BrowserRouter, Route, Routes, Navigate, redirect} from 'react-router-dom';

function goProfile() {
    window.location.href = 'http://localhost:3000/profile';
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
    const [selectedForm, setSelectedForm] = useState(null);

    var obj1 = {"name": "Username", "Username": user["Username"]};
    var obj2 = {"name": "Name", "Username": user["Username"]};
    var obj3 = {"name": "Surname", "Username": user["Username"]};
    var obj4 = {"name": "Password", "Username": user["Username"]};

    return (
        <Container a>
            <Grid item xs={12} sm={8} md={6}>
                <ToggleButtonGroup
                    value={selectedForm}
                    exclusive
                    onChange={(event, newSelectedForm) => setSelectedForm(newSelectedForm)}
                    aria-label="form selection"
                    color={"primary"}
                >
                    <ToggleButton value="username" aria-label="change username">
                        Change Username
                    </ToggleButton>
                    <ToggleButton value="name" aria-label="change name">
                        Change Name
                    </ToggleButton>
                    <ToggleButton value="surname" aria-label="change surname">
                        Change Surname
                    </ToggleButton>
                    <ToggleButton value="password" aria-label="change password">
                        Change Password
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
                {selectedForm === 'username' && <FormForAll prop={obj1}/>}
                {selectedForm === 'name' && <FormForAll prop={obj2}/>}
                {selectedForm === 'surname' && <FormForAll prop={obj3}/>}
                {selectedForm === 'password' && <FormForAll prop={obj4}/>}
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={goProfile}>Back to Profile</Button>
            </Grid>
        </Container>
    );
};
export default UserSettings;