import React, {useState} from 'react';
import {Form, Alert} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {blue} from "@mui/material/colors";
import Button from "@mui/material-next/Button";

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

            setValidationError(response.data);

            setTimeout(() => {setValidationError("")}, 2000)
        } catch (error) {
            setValidationError(error.response);
            setTimeout(() => {setValidationError("")}, 2000)
        }
    };

    const navigate = useNavigate();

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 5,
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5" sx={{marginBottom: '20px'}}>Add a new competition</Typography>
            <Form onSubmit={handleSubmit} style={{width: '40%', display: 'flex', flexDirection: 'column'}}>
                <Form.Group style={{marginBottom: '20px'}} controlId="CompName">
                    <Form.Label><Typography> Name of the competition</Typography></Form.Label>
                    <Form.Control style={{borderRadius: 100}} type="text" name="name"
                                  placeholder="Name of the competition"
                                  onChange={handleChange}/>
                </Form.Group>
                <Form.Group style={{marginBottom: '20px'}} controlId="CompTag">
                    <Form.Label><Typography> Tag</Typography></Form.Label>
                    <Form.Select name="tag" onChange={handleChange} style={{borderRadius: 100}}>
                        <option value="">Select tag</option>
                        {SortedTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group style={{marginBottom: '20px'}} controlId="Start_DateId">
                    <Form.Label><Typography> Start date</Typography></Form.Label>
                    <Form.Control style={{borderRadius: 100}}
                                  type="date"
                                  name="start_date"
                                  onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group style={{marginBottom: '20px'}} controlId="End_DateId">
                    <Form.Label><Typography> End date</Typography></Form.Label>
                    <Form.Control style={{borderRadius: 100}}
                                  type="date"
                                  name="end_date"
                                  onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="filledTonal"
                        sx={{backgroundColor: blue[300], color: '#ffffff', '&:hover': {backgroundColor: blue[200]}}}
                        type="submit">
                    <Typography>Add competition</Typography>
                </Button>
            </Form>

            <Button variant="filledTonal"
                    sx={{
                        backgroundColor: blue[500],
                        color: '#ffffff',
                        marginTop: '30px',
                        '&:hover': {backgroundColor: blue[200]}
                    }}
                    onClick={() => {
                        navigate("/admin_competition")
                    }}>
                <Typography>Back to competitions</Typography>
            </Button>

            {validationError && (
                <Alert severity="error">
                    {validationError}
                </Alert>
            )}
        </Paper>
    )

}

export default AddCompetition;