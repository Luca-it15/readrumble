import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, Route, Routes, Router} from 'react-router-dom';
import CompetitionSpec from './CompetitionSpecification';
import LoginForm from '../pages/Login';
import '../App.css';
function PopularCompetitionBlock() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const goComp = () =>
      {
          navigate('/competitions');
      }

    const goSpecificComp =(Name) =>{
        console.log("ecco il nome: " + Name);
        var dynamic_path = "/competition/"+Name;
        navigate(dynamic_path);

    }
    useEffect(() => {
        // Effettua la richiesta GET al tuo backend
        axios.post('http://localhost:8080/api/competition/retrieve/personal',Username)
          .then(response => {
            // Converti i documenti MongoDB in JSON
            const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
            console.log(jsonData);
            setData(jsonData);
          })
          .catch(error => console.error('Errore nella richiesta GET:', error));
    }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente


  useEffect(() => {
    // Effettua la richiesta GET al tuo backend
    axios.get('http://localhost:8080/api/competition/retrieve')
      .then(response => {
        // Converti i documenti MongoDB in JSON
        const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
        setData(jsonData);
      })
      .catch(error => console.error('Errore nella richiesta GET:', error));
  }, []); // L'array vuoto come dipendenza indica che questo effetto viene eseguito solo una volta al montaggio del componente

  return (
    <Container>

      <Row>
        {data.map(item => (
            <Row>
              <Button className="compButton" onClick={()=>{goSpecificComp(item.Name)}}>
                <p>{item.Name}</p>
                {/* Aggiungi altri campi del documento se necessario */}
              </Button>
            </Row>
        ))}
      </Row>
      <Row>
        <Button className="compMoreComp" onClick={goComp}>More Competitions</Button>
      </Row>
    </Container>
  );
};

export default PopularCompetitionBlock;
