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
    function createRank(value)
    {
        const creator = []
        creator[0] = value[0]
        creator[1] = value[1]
        creator[2] = value[2]
        console.log(creator)
        return(
            creator.map(item =>(
                <Row>
                    <Paper elevation={2} style={PaperStyle}>
                        <Col>
                            <Typography variant="h7" >{item.username}</Typography>
                        </Col>
                        <Col>
                            <Typography variant="h7" >{item.tot_pages}</Typography>
                        </Col>
                    </Paper>
                </Row>
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

  return (
    <Container>

      <Row>
        {data.map(item => (
            <Paper elevation={2} style={PaperStyle} onClick={()=>{goSpecificComp(item.Name)}}>
                {console.log(item)}
                <Typography variant="h6" >{item.name}</Typography>
                <Typography variant="h7" >Tag: {item.tag}</Typography>
                <Typography variant="h6" >Total pages read in the Top 10:  {item.Total_Pages}</Typography>
                <Typography variant="h6" >Rank:</Typography>
                <Typography variant="h7" >{createRank(item.rank)}</Typography>
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
