import React, { useState, useEffect } from 'react';
import { Button, Row,Form,Col } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';

function CompetitionAdmin()
{
    const PaperStyle = {
                    backgroundColor: '#f1f7fa',
                    padding: '10px',
                    margin: '20px 10px 0px 10px',
                    borderRadius: 18,
                    width: '100%',
                    textAlign:'center'
                }
        const PaperStyleAdmin = {
                backgroundColor: 'royalblue',
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
    const [dataForBuild, setDataForBuild] = useState([]);
    const [isLoad, SIL] = useState(false);
    const navigate = useNavigate();
    const logged_user = localStorage.getItem("logged_user");
    const Username = JSON.parse(logged_user)["Username"];
      const [formData, setFormData] = useState({
        searchBar: '' // Inizializza il valore del campo di input
      });

      const handleChange = (event) => {
        const { name, value } = event.target;
        let dataModified = data.filter(obj => obj.name.includes(value));
        setDataForBuild(dataModified);
        ListCreator();
      };
    const goSpecificComp =(Name) =>{
            console.log("ecco il nome: " + Name);
            var dynamic_path = "/admin_competition/"+Name;
            navigate(dynamic_path);

        }
    useEffect(() => {
            // Effettua la richiesta GET al tuo backend
            axios.get('http://localhost:8080/api/competition/retrieve/all')
              .then(response => {
                // Converti i documenti MongoDB in JSON
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));
                setData(jsonData);
                setDataForBuild(jsonData);
                SIL(true);
              }) //ERRORE !
              .catch(error => console.error('Errore nella richiesta GET:', error));

        }, []);

    function ListCreator()
    {
        return(
            dataForBuild.map(item => (
            <Row>
                <Paper elevation={2} style={PaperStyleAdmin} onClick={()=>{goSpecificComp(item.name)}}>
                    <Typography variant="h5" >{item.name}</Typography>
                </Paper>
            </Row>
            ))
        )
    }
    return(

        <Container className= "competitionPage">
            <Row>
                <h1>Competitions</h1>
            </Row>
            <Row>
                <Button onClick={()=>{navigate("/admin_competition/add_comp")}}><h2>Add Competition</h2></Button>
            </Row>
            <Row>
                <Col>
                <h3>Search Competition</h3>
                </Col>
                <Col>
                    <Form /*onSubmit={handleSubmit}*/>
                        <Form.Group className="mb-3" controlId="formSearchBar">
                            <Form.Control type="text" name="SearchBar" placeholder="Search..." onChange={handleChange}/>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <>
                {isLoad ? ListCreator() : "Empty List"}
                </>
            </Row>
        </Container>
    )


}

export default CompetitionAdmin;