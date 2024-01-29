import React, {useState, useEffect} from 'react';
import {Form, Alert, Button, Container, Row} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';

const AddCompetition = () => {
    const tags = [
        "Mystery", "Fantasy", "Non-fiction", "Romance", "Young-adult", "Children", "Comics", "Fiction", "Poetry",
        "History", "Crime", "Paranormal", "Biography", "Thriller", "Historical-fiction", "Graphic"
    ]

    const SortedTags = tags.sort();

    const [formData, setFormData] = useState({
        name: '',
        tag: '',
        start_date: '',
        end_date: '',
    });

    const [addStatus, setAddStatus] = useState({
        message: '',
        variant: 'success',
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

        if (Object.values(formData).some((value) => value === '')) {
            setValidationError('All fields must be filled !');
            return;
        }

        if (formData.start_date > formData.end_date) {
            setValidationError('Start date cannot be after End date');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/admin/competition/add', formData);

            setAddStatus({message: response.data, variant: 'success'});

            setTimeout(setAddStatus({message: '', variant: 'success'}), 2000)
        } catch (error) {
            setAddStatus({message: error.response ? error.response.data : error.message, variant: 'danger'});
        }
    };

    const navigate = useNavigate();

    return (
        <div className="LoginDiv">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="CompName">
                    <Form.Label>Name of the Competition</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Name of the competition"
                                  onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="CompTag">
                    <Form.Label>Name of the Tag</Form.Label>
                    <Form.Select name="tag" onChange={handleChange}>
                        <option value="">Select Tag</option>
                        {SortedTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="Start_DateId">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="start_date"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="End_DateId">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="end_date"
                        //value={selectedDate}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Button className="buttonlogreg" onClick={() => {
                navigate("/admin_competition")
            }}>
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