import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import PostsList from '../../components/PostList';
import {Paper} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';
import {SearchRounded} from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import {blue} from "@mui/material/colors";
import '../../App.css';

export default function PostAdmin() {
    const [searchText, setSearchText] = useState('');
    const [last, setLast] = useState(true);
    const [find, setFind] = useState(false);

    // TODO: creare una funzione che vada a cercare SOLO i post segnalati dal documento dell'admin in Users

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
        height: '40px',
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
            <Typography variant="h5">Post Management</Typography>
                <React.Fragment>
                    <Typography variant='h5'>Reported posts</Typography>
                    <PostsList user={true} username={"admin"} size={12} all={true} path={1}/>
                </React.Fragment>
        </Paper>
    );
}