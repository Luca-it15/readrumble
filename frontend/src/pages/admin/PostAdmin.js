import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import PostsList from '../../components/PostList';
import {Grid, Paper} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';
import {SearchRounded} from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import {blue} from "@mui/material/colors";
import '../../App.css';

export default function PostAdmin() {
    const [value, setValue] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [last, setLast] = useState(true);
    const [find, setFind] = useState(false);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px 10%',
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
        textAlign: 'center',
        '&:hover': {
            backgroundColor: blue[300],
        }
    }

    const handleSearchTextChange = (event) => {
        setLast(false);
        setFind(false);
        setSearchText(event.target.value);
    };

    const handleSearchButtonClick = () => {
        setLast(false);
        setFind(true);
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h4">Post Management</Typography>
            <Box component="form" sx={{display: 'flex', alignItems: 'center'}}>
                <TextField type="text" placeholder="Search" variant="standard" sx={searchBar} value={searchText}
                           onChange={handleSearchTextChange}/>
                <Button sx={searchButton} variant="filledTonal" onClick={handleSearchButtonClick}>
                    <SearchRounded sx={{color: '#ffffff'}}/>
                </Button>
            </Box>

            {last ? (
                <React.Fragment>
                    <Typography variant='h5'>Latest posts</Typography>
                    <PostsList all={true} size={12} path={0}/>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography variant='h5'>Search results:</Typography>
                    <PostsList all={true} size={12} username={searchText} path={2} user={true}/>
                </React.Fragment>
            )}
        </Paper>
    );
}