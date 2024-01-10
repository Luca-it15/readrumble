import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate  } from 'react-router-dom';

function CompetitionProfBlock() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const goComp = () =>
      {
          navigate('/competitions');
      }

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
          <div key={item._id}>
            <p>Nome: {item.Name}</p>
            {/* Aggiungi altri campi del documento se necessario */}
          </div>
        ))}
      </Row>
      <Row>
        <Button onClick={goComp}>More Competitions</Button>
      </Row>
    </Container>
  );
};

export default CompetitionProfBlock;
