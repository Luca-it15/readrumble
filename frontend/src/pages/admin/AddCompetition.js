import React, { useState, useEffect } from 'react';
import {Form, Alert, Button, Container, Row} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';

const AddCompetition = () =>{
    const tags = ["Mystery",
          "Fantasy",
          "Non-fiction",
          "Romance",
          "Young-adult",
          "Children",
          "Comics",
          "Fiction",
          "Poetry",
          "History",
          "Crime",
          "Paranormal",
          "Biography",
          "Thriller",
          "Historical-fiction",
          "Graphic"]
    const SortedTags = tags.sort();
    const [formData, setFormData] = useState({
        CompName: '',
        CompTag: ''
    });

    const [addStatus, setAddStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
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
            return;
        }

        try {
                console.log(formData);
                // Invia la richiesta HTTP qui usando axios
                const response = await axios.post('http://localhost:8080/api/admin/competition/add', formData);
                // Gestisci la risposta qui

                console.log(response.data);

                setAddStatus({message: response.data, variant: 'success'});

                setTimeout(setAddStatus({message:'',variant:'success'}),2000)
            }

        catch (error) {
            // Gestisci gli errori qui
            setAddStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});
        }
    };
    const navigate = useNavigate();
    return(
            <div className="LoginDiv">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="CompName">
                        <Form.Label>Name of the Competition</Form.Label>
                            <Form.Control type="text" name="CompName" placeholder="Name of the competition" onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="CompTag">
                            <Form.Label>Name of the Tag</Form.Label>
                            <Form.Select name="CompTag" onChange={handleChange}>
                                <option value="">Select Tag</option>
                                {SortedTags.map(tag => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                </Form>
            <Button className="buttonlogreg" onClick={()=>{navigate("/admin_competition")}}>
                Back to Competitions
            </Button>

            {validationError && (
                <Alert severity="error">
                    {validationError}
                </Alert>
            )}

            {addStatus.message && (
                <Alert severity={addStatus.variant}>
                    {addStatus.message}
                </Alert>
            )}
        </div>
    )

}

export default AddCompetition;