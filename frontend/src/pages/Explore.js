import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import '../App.css';
import UserList from '../components/UserList';
import PostsList from '../components/PostList';
import {Grid, Paper} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';
import {SearchRounded} from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import SuggestedBooks from '../components/SuggestedBooks';
import TrendingBooks from "../components/TrendingBooks";
import {blue} from "@mui/material/colors";

export default function Explore() {

    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [value, setValue] = useState(0);
    const [toggle1, setToggle1] = useState(true);
    const [toggle2, setToggle2] = useState(false);
    const [toggle3, setToggle3] = useState(false);
    const [searchText, setSearchText] = useState('');

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

    const toggle = {
        padding: '5px 15px',
        border: '1px solid #aaaaaa',
        borderRadius: 5,
        '&:disabled': {
            backgroundColor: blue[500],
            color: '#ffffff',
        }
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

    function getBook() {
        setValue(0);
        setToggle1(true);
        setToggle2(false);
        setToggle3(false);
    }

    function getPost() {
        setValue(1);
        setToggle1(false);
        setToggle2(true);
        setToggle3(false);
    }

    function getUser() {
        setValue(2);
        setToggle1(false);
        setToggle2(false);
        setToggle3(true);
    }

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearchButtonClick = () => {

    };

    const Choice = ({value}) => {
        if (value === 0) {
            return (
                <Grid container direction="row" sx={{gap: '10%'}} justifyContent="center">
                    <Grid iterm xs={4}>
                        <SuggestedBooks user={currentUser['_id']}/>
                    </Grid>
                    <Grid iterm xs={4}>
                        <TrendingBooks/>
                    </Grid>
                </Grid>
            );
        } else if (value === 1) {
            return (
                <Paper sx={PaperStyle}>
                    <PostsList all={true} size={12}/>
                </Paper>
            );
        } else {
            return (
                <Paper sx={PaperStyle}>
                    <UserList/>
                </Paper>
            );
        }
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h4">Explore</Typography>
            <Box component="form" sx={{display: 'flex', alignItems: 'center'}}>
                <TextField type="text" placeholder="Search" variant="standard" sx={searchBar} value={searchText}
                           onChange={handleSearchTextChange}/>
                <Button sx={searchButton} variant="filledTonal" onClick={handleSearchButtonClick}>
                    <SearchRounded sx={{color: '#ffffff'}}/>
                </Button>
            </Box>
            <Grid container direction="column" alignItems="center" justifyContent="space-around">
                <ToggleButtonGroup exclusive aria-label="explore" size="large" role="group"
                                   value="toggleGroup" color="primary">
                    <ToggleButton onClick={getBook} sx={toggle} value="Book" aria-label="Books" disabled={toggle1}>
                        <Typography>Books</Typography>
                    </ToggleButton>
                    <ToggleButton onClick={getPost} sx={toggle} value="Post" aria-label="Posts" disabled={toggle2}>
                        <Typography>Posts</Typography>
                    </ToggleButton>
                    <ToggleButton onClick={getUser} sx={toggle} value="User" aria-label="Users" disabled={toggle3}>
                        <Typography>Users</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
                <Choice value={value}/>
            </Grid>
        </Paper>
    );

}