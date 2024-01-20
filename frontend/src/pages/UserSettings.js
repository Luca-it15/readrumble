import React, {useState} from 'react';
import {Grid, ToggleButton, ToggleButtonGroup, Paper} from '@mui/material';
import '../App.css';
import FormForAll from '../components/FormForAll';
import {blue} from "@mui/material/colors";
import GoBack from "../components/GoBack";

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
    console.log("ecco il nome da user['Name'] " + user["name"]);
} else {
    // La chiave 'isLoggedIn' non è presente in localStorage
    console.log('La chiave "logged_user" non è presente in localStorage.');
}
//<Button onClick={setChangeUser(true)}>Cambia Username</Button>}
const UserSettings = () => {
    const [selectedForm, setSelectedForm] = useState(null);

    var obj2 = {"name": "name", "_id": user["_id"]};
    var obj3 = {"name": "surname", "_id": user["_id"]};
    var obj4 = {"name": "password", "_id": user["_id"]};

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 5,
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }

    const toggle = {
        padding: '5px 15px',
        border: '1px solid #aaaaaa',
        borderRadius: 5,
        '&.Mui-selected': {
            backgroundColor: blue[500],
            color: '#ffffff',
        },
        '&.Mui-selected:hover': {
            backgroundColor: blue[400],
            color: '#ffffff',
        }
    }

    return (
        <Paper sx={PaperStyle}>
            <Grid item xs={12} sm={8} md={6}>
                <GoBack/>
                <ToggleButtonGroup value={selectedForm} exclusive aria-label="form selection" color="primary"
                    onChange={(event, newSelectedForm) => setSelectedForm(newSelectedForm)}>
                    <ToggleButton sx={toggle} value="name" aria-label="change name">
                        Change Name
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="surname" aria-label="change surname">
                        Change Surname
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="password" aria-label="change password">
                        Change Password
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} >
                {selectedForm === 'name' && <FormForAll prop={obj2}/>}
                {selectedForm === 'surname' && <FormForAll prop={obj3}/>}
                {selectedForm === 'password' && <FormForAll prop={obj4}/>}
            </Grid>
        </Paper>
    );
};
export default UserSettings;