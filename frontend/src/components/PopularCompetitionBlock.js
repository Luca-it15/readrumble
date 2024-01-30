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
        padding: '5px 10px',
        borderRadius: '30px',
        width: '100%',
        textAlign: 'center'
    }

    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [displayCount, setDisplayCount] = useState(3);
    const goComp = () => {
        navigate('/competitions');
    }

    const goSpecificComp = (Name) => {
        var dynamic_path = "/competition/" + Name;
        navigate(dynamic_path);

    }

    function createRank(value) {
        if (value[0] == null) {
            return (
                <Typography>No one joined this competition</Typography>
            )
        }

        const creator = []
        creator[0] = value[0]
        creator[1] = value[1]
        creator[2] = value[2]

        return (
            creator.map(item => (
                <Grid container item direction="row" justifyContent="space-between"
                      sx={{backgroundColor: '#ffffff', padding: '10px', borderRadius: 8, marginBottom: '10px'}}>
                    <Link onClick={() => {
                        seeProfile(item.username)
                    }} sx={{color: '#000000', '&:hover': {cursor: 'pointer'}}}>
                        <Typography>{item.username}</Typography>
                    </Link>
                    <Typography>Points: {item.tot_pages}</Typography>
                </Grid>
            ))
        )
    }

    useEffect(() => {
        axios.get('http://localhost:8080/api/competition/retrieve/popular')
            .then(response => {
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));

                setData(jsonData);
            })
            .catch(error => console.error('Errore nella richiesta GET:', error));
    }, []);

    function loadMoreCompetitions() {
        setDisplayCount(displayCount + 3);
    }

    function loadLessCompetitions() {
        setDisplayCount(3);
    }

    function seeProfile(username) {
        if (username === JSON.parse(localStorage.getItem('logged_user'))["_id"]) {
            navigate("/profile")
        } else {
            navigate(`/user/${username}`)
        }
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5" textAlign='center' sx={{margin: '5px'}}>Popular
                competitions</Typography>
            <Grid container direction="column" alignItems="center" justifyContent="center" spacing={1.5}>
                {data.slice(0, displayCount).map((item) => (
                    <Grid container item>
                        <Paper elevation={2} style={PaperStyle}>
                            <Link variant="h6" onClick={() => {
                                goSpecificComp(item.name)
                            }} sx={{'&:hover': {cursor: 'pointer'}}}>
                                {item.name}
                            </Link>
                            <Typography>Tag: {item.tag}</Typography>
                            <Divider variant="middle" sx={{margin: '10px'}}/>
                            <Typography>Total pages read in the Top 10: {item.Total_Pages}</Typography>
                            <Typography sx={{margin: '5px'}}>Top 3:</Typography>
                            <Typography variant="h7">{createRank(item.rank)}</Typography>
                        </Paper>
                    </Grid>
                ))}

                {(data.length > 3 && displayCount === 3) ? (
                    <Button variant="filledTonal" sx={{
                        backgroundColor: blue[200], width: '140px', height: '30px',
                        margin: '10px', '&:hover': {backgroundColor: blue[100]}
                    }}
                            onClick={loadMoreCompetitions}><Typography>Show more</Typography>
                    </Button>
                ) : (
                    <React.Fragment>
                        <Button variant="filledTonal" sx={{
                            backgroundColor: red[200], width: '140px', height: '30px',
                            marginTop: '20px', '&:hover': {backgroundColor: '#ff8a80'}
                        }} onClick={loadLessCompetitions}>
                            <Typography>Show less</Typography>
                        </Button>
                        <Button variant="filledTonal" sx={{
                            backgroundColor: blue[200], width: '140px', height: '30px',
                            margin: '10px 20px 20px 20px', '&:hover': {backgroundColor: '#82b1ff'}
                        }} onClick={loadMoreCompetitions}>
                            <Typography sx={{color: '#000000'}}>Show more</Typography>
                        </Button>
                    </React.Fragment>
                )}

                <Button variant="filledTonal" sx={{color: '#ffffff', backgroundColor: blue[600], marginBottom: '10px',
                    '&:hover': {backgroundColor: blue[500]}
                }}
                        onClick={goComp}><Typography>Find other competitions</Typography></Button>
            </Grid>
        </Paper>
    );
}

export default PopularCompetitionBlock;
