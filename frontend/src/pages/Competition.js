import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import '../App.css';
import {useNavigate} from 'react-router-dom';

function CompetitionPage()
{
    const PaperStyle = {
                backgroundColor: '#f1f7fa',
                padding: '10px',
                margin: '20px 10px 0px 10px',
                borderRadius: 18,
                width: '100%',
                textAlign:'center'
            }
    const PaperStyleJoined = {
            backgroundColor: 'greenyellow',
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            width: '100%',
            textAlign:'center'
        }
    const PaperStyleNotJoined = {
                backgroundColor: 'tomato',
                padding: '10px',
                margin: '20px 10px 0px 10px',
                borderRadius: 18,
                width: '100%',
                textAlign:'center'
            }
        const ButtonStyle = {
            color: 'cadetblue'
        }
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const logged_user = JSON.parse(localStorage.getItem('logged_user'));
    const goSpecificComp =(Name) =>{
            var dynamic_path = "/competition/"+Name;
            navigate(dynamic_path);

        }
    useEffect(() => {
            // Effettua la richiesta GET al tuo backend
            axios.get('http://localhost:8080/api/competition/retrieve/all')
              .then(response => {
                // Converti i documenti MongoDB in JSON
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
                setData(jsonData);

              })
              .catch(error => console.error('Errore nella richiesta GET:', error));
        }, []);
    function giveClass(value)
    {
        let i = 0;
        const iter = logged_user.competitions;
        while(iter[i]!=null)
        {
            if(iter[i].name == value)
            {
                return PaperStyleJoined;
            }
            i=i+1;
        }
        return PaperStyleNotJoined;
    }
    return(

        <Container className= "competitionPage">
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h3" >Competitions</Typography>
                </Paper>
            </Row>
            <Row>
                {data.map(item => (
                    <Row>
                        <Paper elevation={2} style={giveClass(item.name)} onClick={()=>{goSpecificComp(item.name)}}>
                            <Typography variant="h5" >{item.name}</Typography>
                        </Paper>
                    </Row>
                ))}
            </Row>
        </Container>
    )


}

export default CompetitionPage;