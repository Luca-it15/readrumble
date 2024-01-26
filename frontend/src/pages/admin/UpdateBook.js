import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import {Grid, ToggleButton, ToggleButtonGroup, Paper, Typography} from '@mui/material';
import '../../App.css';
import FormForUpdate from '../../components/FormForUpdate'; 
import {blue} from "@mui/material/colors";
import GoBack from "../../components/GoBack";


const UpdateBook = () => {
    const [selectedForm, setSelectedForm] = useState(null);
    let {id} = useParams(); 
    console.log("l'id del libro da cambiare e: " + id)
    var obj2 = {"name": "isbn", "_id": id};
    var obj3 = {"name": "description", "_id": id};
    var obj4 = {"name": "link", "_id": id};
    var obj5 = {"name": "authors", "_id": id};
    var obj6 = {"name": "publisher", "_id": id}; 
    var obj7 = {"name": "num_pages", "_id": id};
    var obj8 = {"name": "publication_year", "_id": id};
    var obj9 = {"name": "url", "_id": id};
    var obj10 = {"name": "image_url", "_id": id};
    var obj11 = {"name": "title", "_id": id};
    var obj12 = {"name": "tags", "_id": id};

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
        border: '2px solid #aaaaaa',
        margin: '10px', 
        backgroundColor: 'white', 
        color: blue[500], 
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
            <GoBack/>
          <Typography variant='h3'>Update Book</Typography>
          <>
            <Grid item xs={12} sm={8} md={6}>
                <ToggleButtonGroup value={selectedForm} orientation="vertical" exclusive aria-label="form selection" color="primary"
                    onChange={(event, newSelectedForm) => setSelectedForm(newSelectedForm)}>
                    <ToggleButton sx={toggle} value="isbn" aria-label="change isbn">
                        Change Isbn
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="description" aria-label="change description">
                        Change description
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="link" aria-label="change link">
                        Change link
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="authors" aria-label="change authors">
                        Change authors
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="publisher" aria-label="change publisher">
                        Change publisher
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="num_pages" aria-label="change num_pages">
                        Change number of pages
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="publication_year" aria-label="change publication_year">
                        Change publication year
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="url" aria-label="change url">
                        Change url
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="image_url" aria-label="change image_url">
                        Change image_url
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="title" aria-label="change title">
                        Change title
                    </ToggleButton>
                    <ToggleButton sx={toggle} value="tags" aria-label="change tags">
                        Change tags
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            </>
            <Grid item xs={12} >
                {selectedForm === 'isbn' && <FormForUpdate prop={obj2}/>}
                {selectedForm === 'description' && <FormForUpdate prop={obj3}/>}
                {selectedForm === 'link' && <FormForUpdate prop={obj4}/>}
                {selectedForm === 'authors' && <FormForUpdate prop={obj5}/>}
                {selectedForm === 'publisher' && <FormForUpdate prop={obj6}/>}
                {selectedForm === 'num_pages' && <FormForUpdate prop={obj7}/>}
                {selectedForm === 'publication_year' && <FormForUpdate prop={obj8}/>}
                {selectedForm === 'url' && <FormForUpdate prop={obj9}/>}
                {selectedForm === 'image_url' && <FormForUpdate prop={obj10}/>}
                {selectedForm === 'title' && <FormForUpdate prop={obj11}/>}
                {selectedForm === 'tags' && <FormForUpdate prop={obj12}/>}
            </Grid>
        </Paper>
    );
};
export default UpdateBook;