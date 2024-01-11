import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
<<<<<<< HEAD
import {useNavigate, Route, Routes, Router} from 'react-router-dom';
import CompetitionSpec from './CompetitionSpecification';
import LoginForm from '../pages/Login';
import '../App.css';
=======
import {useNavigate  } from 'react-router-dom';

>>>>>>> 3705c54282a8a21ad591dbf7b7450dfdbc4017ff
function CompetitionProfBlock() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const logged_user = JSON.parse(localStorage.getItem("logged_user"));
  const Username = logged_user["Username"];
  console.log(Username);

  const goComp = () =>
      {
          navigate('/competitions');
      }
<<<<<<< HEAD
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
=======
>>>>>>> 3705c54282a8a21ad591dbf7b7450dfdbc4017ff

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
      <h1>Lista di documenti:</h1>
      <Row>
        {data.map(item => (
<<<<<<< HEAD
            <Row>
              <Button className="compButton" onClick={()=>{goSpecificComp(item.Name)}}>
                <p>{item.Name}</p>
                {/* Aggiungi altri campi del documento se necessario */}
              </Button>
            </Row>
=======
          <div key={item._id}>
            <p>Nome: {item.Name}</p>
            {/* Aggiungi altri campi del documento se necessario */}
          </div>
>>>>>>> 3705c54282a8a21ad591dbf7b7450dfdbc4017ff
        ))}
      </Row>
      <Row>
        <Button className="compMoreComp" onClick={goComp}>More Competitions</Button>
      </Row>
    </Container>
  );
};

export default CompetitionProfBlock;
