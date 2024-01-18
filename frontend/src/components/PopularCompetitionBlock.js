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
            <Row>
              <Button className="compButton" onClick={()=>{goSpecificComp(item.Name)}}>
              <table>
                <tr>Name: {item.Name}, Tag: {item.Tag}, Number of Participants: {item.UsersCount}</tr>
                <tr>{SortUsers(item.Users)}</tr>
              </table>
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
