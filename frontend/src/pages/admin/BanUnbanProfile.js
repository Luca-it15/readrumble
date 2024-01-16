import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../App.css'

function BanUnbanProfile(){

    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [banStatus,setBanStatus]= useState({
        message:'',
        variant:'success'
    })
    const [data, setData] = useState([]);
    const user = JSON.parse(localStorage.getItem('logged_user'));
    const [isBanned, setIsBanned] = useState(false);
    function goBan()
    {
        var messager = '';
        if(isBanned)
        {
            axios.post("http://localhost:8080/api/admin/user/unban",name)
            .then(response =>{
                messager = response.data;
                setBanStatus({message:messager,variant:'success'});
                setTimeout(()=>{setBanStatus({messagge:'',variant:'success'});},2000)
                setIsBanned(!isBanned);
            })
        }
        else
        {
            axios.post("http://localhost:8080/api/admin/user/ban",name)
            .then(response =>{
                messager = response.data;
                setBanStatus({message:messager,variant:'success'});
                setTimeout(()=>{setBanStatus({messagge:'',variant:'success'});},2000)
                setIsBanned(!isBanned);
            })
        }


    }
    function getUserState()
    {
        //finire la richiesta per prendere i dati dell'utente
        axios.post("http://localhost:8080/api/admin/user/search_user",name)
        .then(response => {

            const jsonData = JSON.parse(JSON.stringify(response.data));
            if(jsonData == '')
            {
                localStorage.setItem("admin_search_response","NO")
                navigate("/admin_user");
            }
            setData(jsonData);
            if(jsonData.isBanned==0)
            {
                setIsBanned(false);
            }
            else
            {
                setIsBanned(true);
            }

        }).catch(error => console.error('Errore nella richiesta GET:', error));
    }
    useEffect(() => { getUserState()
        }, []);    // [] means "Execute this action just at the start of the page"


    return(
    <Container className="CompCon">
        <Row>
            <h1>Ban/Unban the user {data._id}</h1>
        </Row>
        <Row>
            <Col>
                <h3>Name : {data.name}</h3>
            </Col>
            <Col>
                <h3>Surname : {data.surname}</h3>
            </Col>
            <Col>
                <Button onClick={()=>{goBan()}}>{isBanned ? "Unban User" : "Ban User"}</Button>
            </Col>

        </Row>
        <Row>
            {banStatus.message && (
                <Alert severity={banStatus.variant}>
                    {banStatus.message}
                </Alert>
            )}
        </Row>
    </Container>

    )
}

export default BanUnbanProfile;
