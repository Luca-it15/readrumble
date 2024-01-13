import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../App.css'

function CompetitionSpecAdmin(){

    const [load,setLoad] = useState(false);
    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [deleteStatus, setDeleteStatus] = useState({
            message: '',
            variant: 'success', // o 'danger' in caso di errore
    });
    const [data, setData] = useState([]);
    const [isJoin, setJoin] = useState();
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["Username"];
    function BuildRank()
    {
        console.log("BUILDRANK");
        const rank_div = document.getElementById("rank");
        rank_div.innerHTML = null;
        let i = 0;
        const keys = Object.keys(data.Users);
        while(keys[i] != null && i != 10)
        {
            console.log(keys[i]);
            rank_div.innerHTML += '<div class="row"><div class="col"><h3>'+keys[i]+'</h3></div><div class="col"><h3>'+data.Users[keys[i]]+'</h3></div></div>';
            i=i+1;
        }
    }


    function call()
    {
        axios.post('http://localhost:8080/api/competition/getcompinfo',{
                CompetitionTitle: name,
                Username: usernameToAdd
                })
                .then(response => {
                    setData(response.data);
                    console.log("dati settati");
                    setJoin(response.data.isIn === "YES" ? true:false);
                    setLoad(true);
                 })
                 .catch(error => console.error('Errore nella richiesta POST:', error));
    }
    useEffect(() => { call()
        }, []);    // [] means "Execute this action just at the start of the page"

    function deleteCompetition(Name){

        const response = axios.post("http://localhost:8080/api/competition/delete",{
        CompName: Name
        })
        .then(response => {
                    setDeleteStatus({message:response.data,variant:'success'});
        })
        setTimeout(function () {setDeleteStatus({message:"",variant:'success'});},4000);
        BuildRank();
    }
    return(
    <Container className="CompCon">
        <Row>
            <h1> {data.Name} </h1>
        </Row>
        <Row>
            <h2> The tag is : {data.Tag} </h2>
        </Row>
        <Row>
            <h3>Rank</h3>
            {load ? BuildRank(0) : "not loaded"}
            <div id="rank"></div>
        </Row>
        <Row>
            <Button onClick={()=>{deleteCompetition(data.Name)}}> <h3>Delete Competition</h3> </Button>
        </Row>
        <Row>
            {deleteStatus.message && (
                <Alert variant={deleteStatus.variant}>
                    {deleteStatus.message}
                </Alert>
            )}
        </Row>
        <Row>
            <Button onClick={()=>{navigate("/admin_competition")}}> Back To Competitions </Button>
        </Row>

    </Container>

    )
}

export default CompetitionSpecAdmin;
