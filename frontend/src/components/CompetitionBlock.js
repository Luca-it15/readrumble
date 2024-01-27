import React, {useState, useEffect} from 'react';
import Button from '@mui/material-next/Button';
import {Container, Grid, Typography, Paper, Link, ListItem, List} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import {blue} from "@mui/material/colors";
import axios from "axios";

function CompetitionProfBlock({user}) {
    const currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();

    const goComp = () => {
        navigate("/competitions");
    }

    const goSpecificComp = (Name) => {
        var dynamic_path = "/competition/" + Name;
        navigate(dynamic_path);

    }

    function drawComp() {
        if (currentUser['_id'] === user) {
            let participated_competitions = currentUser["competitions"];
            const competitions_to_store = [];
            let i = 0;

            if (participated_competitions == null) {
                participated_competitions = []
            }
            while (participated_competitions[i] != null && i < 3) {
                competitions_to_store[i] = participated_competitions[i];
                i = i + 1;
            }
            setCompetitions(competitions_to_store)
        } else {
            axios.post('http://localhost:8080/api/competition/retrieve/personal', user)
                .then(response => {
                    let jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
                    const competitions_to_store = [];
                    let i = 0;

                    if (jsonData == null) {
                        jsonData = []
                    }

                    while (jsonData[i] != null && i < 3) {
                        competitions_to_store[i] = jsonData[i];
                        i = i + 1;
                    }

                    setCompetitions(competitions_to_store)
                })
                .catch(error => console.error('Error: ', error));
        }
    }

    useEffect(() => {
        drawComp();
    }, []);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 22px',
        borderRadius: 8,
        width: '21vw',
        textAlign: 'center'
    }

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        margin: '10px 0px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    return (
        <Container>
            <Paper sx={PaperStyle}>
                <Grid container direction="column" justifyContent="space-around">
                    <Grid item><Typography variant="h5">Competitions</Typography></Grid>
                    <List sx={ListStyle}>
                        {competitions.length === 0 && (<Grid item>
                                <ListItem>
                                    <Typography>{currentUser['_id'] === user ? "You are " : user + " is "}
                                        not participating in any competition</Typography>
                                </ListItem>
                            </Grid>)}
                        {competitions.map(item => (
                            <Grid item>
                                <ListItem>
                                    <Link onClick={() => {
                                        goSpecificComp(item.name)
                                    }}>
                                        <Typography>{item.name}</Typography>
                                    </Link>
                                </ListItem>
                            </Grid>
                        ))}
                    </List>
                </Grid>

                <Button variant="filled" sx={{backgroundColor: blue[600], marginBottom: '10px'}}
                        onClick={goComp}><Typography>Find other competitions</Typography></Button>
            </Paper>
        </Container>
    );
}

export default CompetitionProfBlock;
