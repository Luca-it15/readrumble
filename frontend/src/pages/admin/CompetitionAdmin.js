import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';

function CompetitionAdmin()
{
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
        let dataModified = data.filter(obj => obj.Name.includes(value));
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
                console.log(data[0]['name']);
                console.log("Ciaooo");
              })
              .catch(error => console.error('Errore nella richiesta GET:', error));

        }, []);

    function giveClass(value)
    {
        if(value[Username]>=0)
        {
            return "competitionLinkTrue"
        }
        else
        {
            return "competitionLinkFalse"
        }

    }
    function ListCreator()
    {
        return(
        dataForBuild.map(item => (
            <Row>
                <Button className={giveClass(item.Users)} onClick={()=>{goSpecificComp(item.name)}}>
                    <h1>{item.name}</h1>
                </Button>
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