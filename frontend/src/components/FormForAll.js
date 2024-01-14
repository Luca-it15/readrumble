import React, {useState} from 'react';
import {TextField, Button, Alert, Container, Box, Grid} from '@mui/material';
import axios from 'axios';
import '../App.css';

const FormForAll = ({prop}) => {
    //pulisce l'area degli alert
    function timeout_text() {
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setLoginStatus({message: '', variant: 'success'});
            setValidationError('');
        }, 1500)
    }

    const [formData, setFormData] = useState({

        old_field: '',
        new_field: '',
        type_of_change_request: prop.name,
        username_to_use: prop._id,

    });

    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success', // o 'error' in caso di errore
    });

    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
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

        try {
            console.log(formData);

            // Invia la richiesta HTTP qui usando axios

            const response = await axios.post('http://localhost:8080/api/change', formData);
            // Gestisci la risposta qui

            setLoginStatus({message: response.data, variant: 'success'});
            timeout_text()
            var storedData = localStorage.getItem('logged_user');


            if (storedData) {

                var user = JSON.parse(storedData);

                user[prop.name] = formData.new_field
                localStorage.setItem('logged_user', JSON.stringify(user));
                setTimeout(function(){window.location.reload()},500);


            } else {

                console.log('La chiave "logged_user" non è presente in localStorage.');
            }
        } catch (error) {
            // Gestisci gli errori qui
            setLoginStatus({message: error.response ? error.response.data : error.message, variant: 'error'});
            timeout_text()
        }
    };

    return (
        <Container className="LoginDiv">
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid xs={12}>
                    <TextField
                        margin="normal"
                        required
                        id="old_field"
                        label={"Old " + prop.name}
                        name="old_field"
                        autoComplete="old_field"
                        autoFocus
                        onChange={handleChange}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        margin="normal"
                        required
                        name="new_field"
                        label={"New " + prop.name}
                        type="text"
                        id="new_field"
                        autoComplete="new_field"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Grid>
            </Box>

            {validationError && (
                <Alert severity="error">
                    {validationError}
                </Alert>
            )}

            {loginStatus.message && (
                <Alert severity={loginStatus.variant}>
                    {loginStatus.message}
                </Alert>
            )}
        </Container>
    );
}

export default FormForAll;