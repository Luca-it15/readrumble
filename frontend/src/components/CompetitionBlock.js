import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import {useNavigate, Route, Routes, Router} from 'react-router-dom';
import CompetitionSpec from './CompetitionSpecification';
import LoginForm from '../pages/Login';
import '../App.css';
function CompetitionProfBlock({user}) {
    //this is the block that contains the first three competition in which you partecipate

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
  const [competitions, setCompetitions] = useState([]);
  const [Username,setUsername] = useState('');
  const navigate = useNavigate();
  console.log("ciao user: ");
  const logged_user = JSON.parse(localStorage.getItem("logged_user"));


    const goComp = () =>
    {
        navigate("/competitions");
    }

    const goSpecificComp =(Name) =>{
        console.log("ecco il nome: " + Name);
        var dynamic_path = "/competition/"+Name;
        navigate(dynamic_path);

    }
    function drawComp()
    {
        const competitions_partecipated = logged_user["competitions"];
        const competitions_to_store = [];
        let i = 0;
        while(competitions_partecipated[i]!=null & i<3)
        {
            competitions_to_store[i]=competitions_partecipated[i];
            i = i+1;
        }
        setCompetitions(competitions_to_store)
    }


    useEffect(() => {

             drawComp();

    }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente


  /*useEffect(() => {
    // Effettua la richiesta GET al tuo backend
    axios.get('http://localhost:8080/api/competition/retrieve')
      .then(response => {
        // Converti i documenti MongoDB in JSON
        const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
        setData(jsonData);
      })
      .catch(error => console.error('Errore nella richiesta GET:', error));
  }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente
*/
  return (

    <Container>

          <Row>
            {competitions.map(item => (
                <Paper elevation={2} style={PaperStyle} onClick={()=>{goSpecificComp(item.name)}}>
                    <Typography variant="h5" >{item.name}</Typography>
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

export default CompetitionProfBlock;
