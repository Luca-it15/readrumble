import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, FormControlLabel, Checkbox, ListItem, List } from '@mui/material';
import {Paper, Grid} from '@mui/material'; 
import {Alert} from '@mui/material';
import {blue} from '@mui/material/colors'; 
import {Form} from 'react-bootstrap'; 

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
    const { name, value } = event.target;
    let new_value = 0; 
    if(name === "num_pages" || name === "published_year")
     new_value = parseInt(value); 
    else if(name === "authors")
     new_value = value.split(","); 
    else if(name === "tags")
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

   const tags = [
    "mystery", "fantasy", "non-fiction", "romance", "young-adult", "children", "comics", "fiction", "poetry",
    "history", "crime", "paranormal", "biography", "thriller", "historical-fiction", "graphic"
   ]

  const SortedTags = tags.sort();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione: Verifica se almeno un campo è vuoto
    if (Object.values(book).some((value) => value === '')) {
      setValidationError('All fields must be filled !');
      //timeout_text()
      return;
  } else if(selectedTags.length < 3) {
      setValidationError('choose at least 3 type of tags!');
      console.log("ho selezionato :" + selectedTags.length + " tags"); 
      //timeout_text()
      return;
  }



    try {
        // Invia i dati al server usando Axios
        const response = await axios.post('http://localhost:8080/api/admin/book/add', book);
        setValidationSuccess(response.data);
        timeout_text()
        // Esegui altre azioni dopo la submit se necessario
    } catch (error) {
        setValidationError(error);
        timeout_text_error()
    }
};

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

  const TagStyle = {
    backgroundColor: 'FFFFFF',
    padding: '10px',
    margin: '10px',
    borderRadius: 5,
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3pt solid' + blue[300]
  }

  const searchBar = {
        backgroundColor: 'white',
        borderRadius: 5,
        margin: '10px',
        fontSize: '18pt',
        width: '25vw',
        border: '3pt solid' + blue[300]
    }

    const searchButton = {
        backgroundColor: blue[400],
        margin: '5px',
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
            <Paper sx={PaperStyle}>
                <GoBack></GoBack>
                <Typography variant='h3' sx={{ margin: '30px' }}>Add Book</Typography>
    
                <Grid container direction="row" alignItems="center" justifyContent="center" xs={12}>
    
                    <Form onSubmit={handleSubmit}>
                        <TextField label="ISBN" name="isbn" value={book.isbn} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Description" name="description" value={book.description} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Link" name="link" value={book.link} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Authors" name="authors" value={book.authors} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Publisher" name="publisher" value={book.publisher} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Number of pages" name="num_pages" value={book.pageCount} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="publication_year" name="publication_year" value={book.publishedDate} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Book Url" name="url" value={book.bookUrl} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Image Url" name="image_url" value={book.imageUrl} onChange={handleChange} sx={searchBar} />
                        <br />
                        <TextField label="Title" name="title" value={book.title} onChange={handleChange} sx={searchBar} />
                        <br />
                        <Paper sx={TagStyle}>
                          <Typography variant='h4'>choose at least 3 type of tags</Typography>
                        <List>
                        {SortedTags.map((tag) => (
                          <ListItem>
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
                            </ListItem>
                        ))}
                        </List>
                        </Paper>
                        <br />
                        {(validationError && 
                <Alert variant="filled" severity="error">
                {validationError}
               </Alert> )} 
                {(validationSuccess) && 
                  (<Alert variant="filled" severity="success">
                  {validationSuccess}
                 </Alert>
                  )}
                        <Button variant="contained" type="submit" sx={searchButton}>Submit</Button>
                    </Form>
                </Grid>
             
    
            </Paper>
        );
    }
    

export default AddBook;
