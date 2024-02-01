import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import PostsList from '../../components/PostList';
import {Grid, Paper} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';
import {SearchRounded} from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import {blue} from "@mui/material/colors";
import '../../App.css';
import BookListShow from '../../components/BookListShow';
import BookListQuery from '../../components/BookListQuery';


export default function BookAdmin() {

    const [value, setValue] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [last, setLast] = useState(true); 
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

    const searchBar = {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: '10px',
        fontSize: '18pt',
        padding: '5px 10px',
        width: '25vw',
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

    function addBook() {
        navigate("/addBook"); 
    }

    const handleSearchTextChange = (event) => {
        setLast(false);
        setSearchText(event.target.value);
    };

    const handleSearchButtonClick = () => {
        setLast(false);
    }  


    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h4">Books Management</Typography>
            <Box component="form" sx={{display: 'flex', alignItems: 'center'}}>
                <TextField type="text" placeholder="Search" variant="standard" sx={searchBar} value={searchText}
                           onChange={handleSearchTextChange}/>
                <Button sx={searchButton} variant="filledTonal" onClick={handleSearchButtonClick}>
                    <SearchRounded sx={{color: '#ffffff'}}/>
                </Button>
                <Button variant="filledTonal" onClick={addBook} sx={searchButton}>
                   <Typography variant='h6'>Add Books</Typography>
                </Button>
            </Box>
            <Paper sx={PaperStyle}>
                {last? (
                <>    
                <Typography variant='h3'>trending Books</Typography>
                <Grid iterm xs={4}>
                        <BookListQuery query={"trending"}/>
                    </Grid>
                </>
                ) : (
                  <>  
                <Typography variant='h3'>Search Books</Typography>
                <BookListShow title={searchText} /> 
                </>
             )}
            </Paper>
        </Paper>
    );

}