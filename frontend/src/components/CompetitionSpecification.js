import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../App.css'

function CompetitionSpec(){
    const [load,setLoad] = useState(false);
    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [joinStatus, setJoinStatus] = useState({
            message: '',
            variant: 'success', // o 'danger' in caso di errore
    });
    const [data, setData] = useState([]);
    const [isJoin, setJoin] = useState();
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["_id"];

    function BuildRank()
    {
        const rank_div = document.getElementById("rank");
        rank_div.innerHTML = null;
        const sortedObject = {};
        const originalObject = data.Users;
        Object.keys(originalObject).sort((a, b) => originalObject[b] - originalObject[a]).forEach(key => {
          sortedObject[key] = originalObject[key];
        });

        const keys = Object.keys(sortedObject);
        const values = Object.values(sortedObject)
        let i = 0;
        while(keys[i] != null && i != 10)
        {
            rank_div.innerHTML += '<div class="row"><div class="col"><h3>'+keys[i]+'</h3></div><div class="col"><h3>'+values[i]+'</h3></div></div>';
            i=i+1;
        }
    }
     function givename()
     {
        if(isJoin===true)
        {
            return "Leave Competition"
        }
        else
        {
            return "Join Competition"
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
        }, []);
    function joinCompetition(Name){
        ;
        const response = axios.post("http://localhost:8080/api/competition/join",{
        parametro1: usernameToAdd,
        parametro2: Name
        })
        .then(response => {
                    setJoinStatus({message:response.data,variant:'success'});
        })
        setTimeout(function () {setJoinStatus({message:"",variant:'success'});},4000);
        setJoin(!isJoin);
        if(isJoin == false)
        {
            data.Users[usernameToAdd]=0;
        }
        else
        {
            delete(data.Users[usernameToAdd])
        }
        rankPosition();
        BuildRank();
    }
    function rankPosition()
    {
        const keys = Object.keys(data.Users)
        var i = 0;
        while(keys[i] != null)
        {
            if(keys[i] === usernameToAdd)
            {
                i = i+1;
                var result = "You are in " + i + " position !";
                return result
            }
            else
            {
                i = i+1;
            }

        }
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
            <h3>Rank</h3>
            {load ? BuildRank(0) : "not loaded"}
            <div id="rank"></div>
        </Row>
        <Row>
            {isJoin ? <h4>{rankPosition()}</h4> : <h4>You do not partecipate in the competition</h4>}
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