import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../App.css'

function CompetitionSpec(){
    var isJoined = false
    const { name } = useParams();
    const navigate = useNavigate();
    const [joinStatus, setJoinStatus] = useState({
            message: '',
            variant: 'success', // o 'danger' in caso di errore
    });
    const [data, setData] = useState([]);
    const [isJoin, setJoin] = useState();
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["Username"]
     function givename()
     {
        console.log(isJoined)
        if(isJoin===true)
        {
            return "Leave Competition"
        }
        else
        {
            return "Join Competition"
        }

     }

    useEffect(() => {axios.post('http://localhost:8080/api/competition/getcompinfo',{
        CompetitionTitle: name,
        Username: usernameToAdd
        })
        .then(response => {
            setData(response.data);
            console.log("dati settati");
            setJoin(response.data.isIn === "YES" ? true:false)
         })
         .catch(error => console.error('Errore nella richiesta POST:', error));

                    // Effettua la richiesta GET al tuo backend

        }, []);
    function joinCompetition(Name){

        const response = axios.post("http://localhost:8080/api/competition/join",{
        parametro1: usernameToAdd,
        parametro2: Name
        })
        .then(response => {
                    setJoinStatus({message:response.data,variant:'success'});
        })
        setTimeout(function () {setJoinStatus({message:"",variant:'success'});},4000);
        setJoin(!isJoin)
    }

    // [] means "Execute this action just at the start of the page"
    return(
    <Container className="CompCon">
        <Row>
            <h1> {data.Name} </h1>
        </Row>
        <Row>
            <h2> The tag is : {data.Tag} </h2>
        </Row>
        <Row>
        </Row>
        <Row>
            <Button onClick={()=>{joinCompetition(data.Name)}}> {givename()} </Button>
        </Row>
        <Row>
            {joinStatus.message && (
                <Alert variant={joinStatus.variant}>
                    {joinStatus.message}
                </Alert>
            )}
        </Row>
        <Row>
            <Button onClick={()=>{navigate("/competitions")}}> Back To Competitions </Button>
        </Row>
    </Container>

    )
}

export default CompetitionSpec;