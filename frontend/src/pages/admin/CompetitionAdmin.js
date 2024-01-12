import React, { useState, useEffect } from 'react';
import { Button, Container, Row} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';

function CompetitionAdmin()
{
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const logged_user = localStorage.getItem("logged_user");
    const Username = JSON.parse(logged_user)["Username"]
    const goSpecificComp =(Name) =>{
            console.log("ecco il nome: " + Name);
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
        if(value[Username]>=0)
        {
            return "competitionLinkTrue"
        }
        else
        {
            return "competitionLinkFalse"
        }

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
                {data.map(item => (
                    <Row>
                        <Button className={giveClass(item.Users)} onClick={()=>{goSpecificComp(item.Name)}}>
                            <h1>{item.Name}</h1>
                        </Button>
                    </Row>
                ))}
            </Row>
        </Container>
    )


}

export default CompetitionAdmin;