import React, {useState, useEffect} from 'react';
import {Grid, Typography, Paper, Link, Divider} from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import Button from '@mui/material-next/Button';
import {blue, red} from "@mui/material/colors";

function PopularCompetitionBlock() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [displayCount, setDisplayCount] = useState(3);
// questo blocco deve mostrarmi le competitizioni più gettonate, tipo 10
    const goComp = () => {
        navigate('/competitions');
    }

    const goSpecificComp = (Name) => {
        console.log("ecco il nome: " + Name);
        var dynamic_path = "/competition/" + Name;
        navigate(dynamic_path);

    }
    function createRank(value) {
        const creator = []
        creator[0] = value[0]
        creator[1] = value[1]
        creator[2] = value[2]
        console.log(creator)
        return (
            creator.map(item => (
                <Grid container item direction="row" justifyContent="space-between"
                      sx={{backgroundColor: '#ffffff', padding: '10px', borderRadius: 8, marginBottom: '10px'}}>
                    <Typography><strong>{item.username}</strong></Typography>
                    <Typography>Points: {item.tot_pages}</Typography>
                </Grid>
            ))
        )
    }

    useEffect(() => {
        // Effettua la richiesta GET al tuo backend
        axios.get('http://localhost:8080/api/competition/retrieve/popular')
            .then(response => {
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
                console.log(jsonData);
                setData(jsonData);
            })
            .catch(error => console.error('Errore nella richiesta GET:', error));
    }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente

    function loadMoreCompetitions() {
        setDisplayCount(displayCount + 3);
    }

    function loadLessCompetitions() {
        setDisplayCount(3);
    }

    return (
        <Paper sx={{backgroundColor: '#f1f7fa', paddingRight: '16px', margin: '20px 10px 0px 10px', borderRadius: 8,
                width: '100%', textAlign: 'center'}}>
            <Grid container direction="column" alignItems="center" justifyContent="center">
                <Typography variant="h5" textAlign='center' sx={{marginTop: '10px', marginBottom: '-10px'}}>Popular competitions</Typography>
                {data.slice(0, displayCount).map((item) => (
                    <Grid item>
                        <Paper elevation={2} style={PaperStyle}>
                            <Link variant="h6" onClick={() => {
                                goSpecificComp(item.name)
                            }}>{item.name}</Link>
                            <Typography>Tag: {item.tag}</Typography>
                            <Divider variant="middle" sx={{margin: '10px'}}/>
                            <Typography>Total pages read in the Top 10: {item.Total_Pages}</Typography>
                            <Typography sx={{margin: '5px'}}>Top 3:</Typography>
                            <Typography variant="h7">{createRank(item.rank)}</Typography>
                        </Paper>
                    </Grid>
                ))}

                {(data.length > 3 && displayCount === 3) ? (
                    <Button variant="filled" sx={{backgroundColor: blue[200], width: '140px', height: '30px',
                        margin: '10px', '&:hover': {backgroundColor: blue[100]}}}
                            onClick={loadMoreCompetitions}><Typography>Show more</Typography>
                    </Button>
                ) : (
                    <>
                        <Button variant="filled" sx={{backgroundColor: red[200], width: '140px', height: '30px',
                            margin: '10px', '&:hover': {backgroundColor: red[100]}}} onClick={loadLessCompetitions}>
                            <Typography>Show less</Typography>
                        </Button>
                        <Button variant="filled" sx={{backgroundColor: blue[200], width: '140px', height: '30px',
                            margin: '10px', '&:hover': {backgroundColor: blue[100]}}} onClick={loadMoreCompetitions}>
                            <Typography>Show more</Typography>
                        </Button>
                    </>
                )}

                <Button variant="filled" sx={{backgroundColor: blue[600], marginBottom: '10px'}}
                        onClick={goComp}><Typography>Find other competiitons</Typography></Button>
            </Grid>
        </Paper>
    );
}

export default PopularCompetitionBlock;
