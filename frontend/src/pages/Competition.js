import React, {useState, useEffect} from 'react';
import {Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import '../App.css';
import {useNavigate} from 'react-router-dom';
import {blue} from "@mui/material/colors";
import Button from "@mui/material-next/Button";

function CompetitionPage() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 8,
        width: '70vw',
        textAlign: 'center'
    }

    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const goSpecificComp = (Name) => {
        var dynamic_path = "/competition/" + Name;
        navigate(dynamic_path);

    }

    useEffect(() => {
        axios.get('http://localhost:8080/api/competition/retrieve/all')
            .then(response => {
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
                setData(jsonData);

            }).catch(error => console.error('Errore nella richiesta GET:', error));
    }, []);

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h4" sx={{margin: '10px'}}>Ongoing competitions</Typography>
            <Grid container direction="row" textAlign="center" alignItems="center" justifyContent="space-evenly">
                {data.map(item => (
                    <React.Fragment>
                        <Grid item xs={4}>
                            <Paper sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                margin: '10px 10px 10px 10px',
                                padding: '10px',
                                '&:hover': {boxShadow: '0px 3px 8px 0px rgba(0,0,0,0.2)', margin: '5px 10px 15px 10px'}
                            }} elevation={0}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography sx={{color: '#888888'}}>Tag: {item.tag}</Typography>
                                <Button variant="filledTonal" sx={{
                                    marginTop: '10px', backgroundColor: blue[200], padding: '5px 15px',
                                    '&:hover': {backgroundColor: blue[100]}
                                }} onClick={() => {
                                    goSpecificComp(item.name)
                                }}>
                                    <Typography>See details</Typography>
                                </Button>
                            </Paper>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Paper>
    )


}

export default CompetitionPage;