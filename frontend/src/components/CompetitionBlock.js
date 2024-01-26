import React, {useState, useEffect} from 'react';
import Button from '@mui/material-next/Button';
import {Container, Grid, Typography, Paper, Link, ListItem, List} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import {blue} from "@mui/material/colors";

function CompetitionProfBlock({user}) {
    const currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [competitions, setCompetitions] = useState([]);
    const [Username, setUsername] = useState('');
    const [data, setData] = useState([])
    const navigate = useNavigate();
    console.log("ciao user: ");

    const goComp = () => {
        navigate("/competitions");
    }

    const goSpecificComp = (Name) => {
        console.log("ecco il nome: " + Name);
        var dynamic_path = "/competition/" + Name;
        navigate(dynamic_path);

    }

    function drawComp() {
        if (currentUser['_id'] === user) {
            const competitions_partecipated = currentUser["competitions"];
            const competitions_to_store = [];
            let i = 0;
            while (competitions_partecipated[i] != null && i < 3) {
                competitions_to_store[i] = competitions_partecipated[i];
                i = i + 1;
            }
            setCompetitions(competitions_to_store)
        } else {
            axios.post('http://localhost:8080/api/competition/retrieve/personal',user)
            .then(response => {
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
                const competitions_to_store = [];
                let i = 0;
                while (jsonData[i] != null && i < 3) {
                    competitions_to_store[i] = jsonData[i];
                    i = i + 1;
                }
                setCompetitions(competitions_to_store)
            })
            .catch(error => console.error('Errore nella richiesta GET:', error));
        }
    }

    useEffect(() => {
        drawComp();
    }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente

    /*useEffect(() => {
      // Effettua la richiesta GET al tuo backend

    }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente
  */

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
                        {competitions.length === 0 && (
                            <Grid item>
                                <ListItem>
                                    <Typography>{currentUser['_id'] === user ? "You are " : user + " is "}
                                        not participating in any competition</Typography>
                                </ListItem>
                            </Grid>
                        )}
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
};

export default CompetitionProfBlock;
