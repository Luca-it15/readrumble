import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

class SearchBar extends Component {
    render() {
        return (
            <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField type="text" placeholder="Cerca" variant="outlined" sx={{ mr: 2 }} />
                <Button variant="contained" color="primary">Cerca</Button>
            </Box>
        );
    }
}

class SearchResults extends Component {
    render() {
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="h5">Risultati della ricerca:</Typography>
                <List>
                    <ListItem>Risultato 1</ListItem>
                    <ListItem>Risultato 2</ListItem>
                    <ListItem>Risultato 3</ListItem>
                </List>
            </Box>
        );
    }
}

class Explore extends Component {
    render() {
        return (
            <Container>
                <Typography variant="h3">Esplora</Typography>
                <SearchBar />
                <SearchResults />
            </Container>
        );
    }
}

export default Explore;
