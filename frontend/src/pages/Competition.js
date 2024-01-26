import React, {useState, useEffect} from 'react';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import {Container, Grid, Typography, Paper, ListItem, List, Divider, Tooltip} from '@mui/material';
import axios from 'axios';
import '../App.css';
import {useNavigate} from 'react-router-dom';
import {blue} from "@mui/material/colors";

function CompetitionPage() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 8,
        width: '70vw',
        textAlign: 'center'
    }

    const PaperStyleJoined = {
        backgroundColor: 'greenyellow',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const PaperStyleNotJoined = {
        backgroundColor: 'tomato',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const logged_user = JSON.parse(localStorage.getItem('logged_user'));

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

    function giveClass(value) {
        let i = 0;
        const iter = logged_user.competitions;

        while (iter[i] != null) {
            if (iter[i].name == value) {
                return PaperStyleJoined;
            }
            i = i + 1;
        }
        return PaperStyleNotJoined;
    }

    return (
        <Paper sx={PaperStyle}>
                    <Typography variant="h4">Ongoing competitions</Typography>
            <Grid container direction="column" textAlign="center" alignItems="center" justifyContent="center">
                <Paper elevation={1} sx={{backgroundColor: '#ffffff', borderRadius: 8, margin: '10px', width: '50%'}}>
                    <List>
                        {data.map(item => (
                            <React.Fragment>
                                <ListItem sx={{'&:hover': {backgroundColor: '#f1f7fa'}}}
                                          secondaryAction={
                                              <Tooltip title="Go to the competition page">
                                                  <InfoTwoToneIcon sx={{color: blue[300]}} onClick={() => {goSpecificComp(item.name)}}/>
                                              </Tooltip>
                                          }>
                                    <Typography variant="h6">{item.name}</Typography>
                                </ListItem>
                                <Divider variant="middle" component="li"/>
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Paper>
    )


}

export default CompetitionPage;