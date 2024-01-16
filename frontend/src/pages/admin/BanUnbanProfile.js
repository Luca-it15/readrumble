import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../App.css'

function BanUnbanProfile(){

    const [load,setLoad] = useState(false);
    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isJoin, setJoin] = useState();
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["_id"];
    function getUserState()
    {
        //finire la richiesta per prendere i dati dell'utente
        axios.post("http://localhost:8080/")
    }
    useEffect(() => {
        }, []);    // [] means "Execute this action just at the start of the page"


    return(
    <Container className="CompCon">
        <Row>
            <h1>Ban/Unban the user {}</h1>
        </Row>
        <Row>
        </Row>

    </Container>

    )
}

export default BanUnbanProfile;
