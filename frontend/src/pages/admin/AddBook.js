import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {TextField, Typography, FormControlLabel, Checkbox} from '@mui/material';
import {Grid} from '@mui/material';
import {Alert} from '@mui/material';
import {blue} from '@mui/material/colors';
import {Form} from 'react-bootstrap';
import Button from '@mui/material-next/Button';

import GoBack from '../../components/GoBack';

function AddBook() {
    const [book, setBook] = useState({
        isbn: '',
        description: '',
        link: '',
        authors: [],
        publisher: '',
        num_pages: 0,
        publication_year: 0,
        url: '',
        image_url: '',
        title: '',
        tags: []
    });

    const navigate = useNavigate();

    const [selectedTags, setSelectedTags] = useState([]);

    function timeout_text() {
        setTimeout(function () {
            navigate(-1);
        }, 12000)
    }

    function timeout_text_error() {
        setTimeout(function () {
            navigate(-1);
        }, 24000)
    }

    const [validationError, setValidationError] = useState('');
    const [validationSuccess, setValidationSuccess] = useState('');

    function handleChange(event) {
        const {name, value} = event.target;
        let new_value = 0;
        if (name === "num_pages" || name === "published_year")
            new_value = parseInt(value);
        else if (name === "authors")
            new_value = value.split(",");
        else if (name === "tags")
            tags = selectedTags;
        else
            new_value = value;
        setBook(prevBook => {
            return {
                ...prevBook,
                [name]: new_value
            };
        });
    }

    let tags = [
        "mystery", "fantasy", "non-fiction", "romance", "young-adult", "children", "comics", "fiction", "poetry",
        "history", "crime", "paranormal", "biography", "thriller", "historical-fiction", "graphic"
    ]

    const SortedTags = tags.sort();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(book).some((value) => value === '')) {
            setValidationError('All fields must be filled !');
            return;
        } else if (selectedTags.length < 3) {
            setValidationError('choose at least 3 type of tags!');
            console.log("ho selezionato :" + selectedTags.length + " tags");
            return;
        }


        try {
            const response = await axios.post('http://localhost:8080/api/admin/book/add', book);
            setValidationSuccess(response.data);
            timeout_text()
        } catch (error) {
            setValidationError(error);
            timeout_text_error()
        }
    };

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        margin: '10px',
        borderRadius: 5,
        width: '90%'
    }

    const TagStyle = {
        backgroundColor: '#ffffff',
        padding: '0px 0px 0px 15px',
        margin: '10px',
        borderRadius: 5,
        '&:selected': {
            backgroundColor: '#f1f7fa',
        }
    }

    const searchBar = {
        backgroundColor: '#ffffff',
        borderRadius: "20px",
        fontSize: '18pt',
        width: '100%',
        padding: '5px 15px',
    }

    const searchButton = {
        backgroundColor: blue[400],
        margin: '15px',
        borderRadius: 10,
        color: 'white',
        textAlign: 'center',
        '&:hover': {
            backgroundColor: blue[300],
        }
    }

    const handleTagChange = (event) => {
        if (event.target.checked) {
            setSelectedTags([...selectedTags, event.target.name]);
        } else {
            setSelectedTags(selectedTags.filter(tag => tag !== event.target.name));
        }
    };

    return (
        <Grid sx={PaperStyle}>
            <GoBack/>
            <Typography variant='h5' textAlign="center" sx={{marginBottom: '30px'}}>Add Book</Typography>
            <Form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Grid container direction="row" alignItems="center" justifyContent="space-evenly" spacing={2}
                      sx={{width: '90%'}}>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="ISBN" name="isbn" value={book.isbn} onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Title" name="title" value={book.title}
                                   onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Link" name="link" value={book.link} onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Authors (comma separated)" name="authors"
                                   value={book.authors}
                                   onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Publisher" name="publisher" value={book.publisher}
                                   onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Number of pages" name="num_pages" value={book.pageCount}
                                   onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Publication year" name="publication_year"
                                   value={book.publishedDate}
                                   onChange={handleChange} sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Book Url" name="url" value={book.bookUrl}
                                   onChange={handleChange} sx={searchBar}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Image Url" name="image_url" value={book.imageUrl}
                                   onChange={handleChange}
                                   sx={searchBar}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField InputLabelProps={{
                            style: {paddingLeft: '30px', fontSize: '15pt'},
                        }} focused variant="standard" label="Description" name="description" value={book.description}
                                   onChange={handleChange}
                                   multiline={true} rows={4}
                                   sx={searchBar}/>
                    </Grid>

                    <Typography sx={{marginTop: '10px'}} textAlign="center" variant='h6'>Choose at least three tags:</Typography>

                    <Grid container direction="row" alignItems="center" justifyContent="center">
                        {SortedTags.map((tag) => (
                            <Grid item sx={selectedTags.includes(tag) ? {...TagStyle, backgroundColor: blue[100]} : TagStyle}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedTags.includes(tag)}
                                            onChange={handleTagChange}
                                            name={tag}
                                        />
                                    }
                                    label={tag}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {(validationError &&
                    <Alert variant="filled" severity="error">
                        {validationError}
                    </Alert>)}
                {(validationSuccess) &&
                    (<Alert variant="filled" severity="success">
                            {validationSuccess}
                        </Alert>
                    )}
                <Button variant="filledTonal" type="submit" sx={searchButton}>
                    <Typography>Add book</Typography>
                </Button>
            </Form>
        </Grid>
);}

export default AddBook;
