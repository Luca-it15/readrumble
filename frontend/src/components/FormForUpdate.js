import React, {useState} from 'react';
import {TextField, Button, Alert, Container, Box, Grid} from '@mui/material';
import axios from 'axios';
import '../App.css';

const FormForUpdate = ({prop}) => {
    //pulisce l'area degli alert
    function timeout_text() {
        setTimeout(function () {
            // Azione da compiere dopo 1 secondo
            setLoginStatus({message: '', variant: 'success'});
            setValidationError('');
        }, 12000)
    }

    const [formData, setFormData] = useState({

        new_field: '',
        type_of_change_request: prop.name,
        id_to_use: prop._id,

    });

    const formBar = {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: '10px',
        fontSize: '18pt',
        padding: '5px 10px',
        width: '25vw',
    }

    const [loginStatus, setLoginStatus] = useState({
        message: '',
        variant: 'success', // o 'error' in caso di errore
    });

    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        let new_value = ''; 
        if(prop.name === 'num_pages' || prop.name === 'publication_year')
          new_value = parseInt(value); 
        else if(prop.name === 'tags' || prop.name === 'authors') {
          new_value = new Array();  
          new_value = value.split(','); 
        }
        else 
          new_value = value; 
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : new_value,
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

            const response = await axios.post('http://localhost:8080/api/admin/book/update', formData);
            // Gestisci la risposta qui

            setLoginStatus({message: response.data, variant: 'success'});
            timeout_text()

        } catch (error) {
            // Gestisci gli errori qui
            setLoginStatus({message: error.response ? error.response.data : error.message, variant: 'error'});
            timeout_text()
        }
    };

    return (
        <Container className="LoginDiv">
            <Box component="form" onSubmit={handleSubmit} noValidate >
                
                <Grid item xs={12}>
                    <TextField
                        margin="normal"
                        required
                        name="new_field"
                        label={"New " + prop.name}
                        type="text"
                        id="new_field"
                        autoComplete="new_field"
                        onChange={handleChange}
                        sx={formBar}
                    />
                </Grid>
                <Grid item xs={12}>
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

export default FormForUpdate;