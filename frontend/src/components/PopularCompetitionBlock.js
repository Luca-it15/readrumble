import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import {useNavigate, Route, Routes, Router} from 'react-router-dom';
import CompetitionSpec from './CompetitionSpecification';
import LoginForm from '../pages/Login';
import '../App.css';
function PopularCompetitionBlock() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
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
// questo blocco deve mostrarmi le competitizioni più gettonate, tipo 10
  const goComp = () =>
      {
          navigate('/competitions');
      }

    const goSpecificComp =(Name) =>{
        console.log("ecco il nome: " + Name);
        var dynamic_path = "/competition/"+Name;
        navigate(dynamic_path);

    }
    function SortUsers(us)
    {
        const sortedObject = {};
        Object.keys(us).sort((a, b) => us[b] - us[a]).forEach(key => {
          sortedObject[key] = us[key];
        });

        console.log(sortedObject);
        const keysArray = Object.keys(sortedObject);
        console.log(keysArray);
        const valuesArray = Object.values(sortedObject);
        console.log(valuesArray);
        return (
            <Container>
                <Row><Col>{keysArray[0]}</Col><Col>{valuesArray[0]}</Col></Row>
                <Row><Col>{keysArray[1]}</Col><Col>{valuesArray[1]}</Col></Row>
                <Row><Col>{keysArray[2]}</Col><Col>{valuesArray[2]}</Col></Row>
            </Container>
        )
     }
    useEffect(() => {
        // Effettua la richiesta GET al tuo backend
        axios.get('http://localhost:8080/api/competition/retrieve/popular')
          .then(response => {
            console.log(response);
            // Converti i documenti MongoDB in JSON
            const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
            console.log(jsonData);
            setData(jsonData);
          })
          .catch(error => console.error('Errore nella richiesta GET:', error));
    }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente

  return (
    <Container>

      <Row>
        {data.map(item => (
            <Paper elevation={2} style={PaperStyle} onClick={()=>{goSpecificComp(item.Name)}}>
                <Typography variant="h5" >{item.Name}</Typography>
                <Typography variant="h5" >{item.Tag}</Typography>
                <Typography variant="h5" >Participants: {item.UsersCount}</Typography>
                <Typography variant="h5" >Rank:</Typography>
                <Typography variant="h5" >{SortUsers(item.Users)}</Typography>
            </Paper>
        ))}
      </Row>
      <Row>
        <Paper elevation={2} style={PaperStyle} onClick={goComp} >
            <Typography variant="h5" style={ButtonStyle}>More Competitions</Typography>
        </Paper>
      </Row>
    </Container>
  );
};

export default PopularCompetitionBlock;
