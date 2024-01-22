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
        console.log(originalObject);
        console.log(data)
        const vect = data.Users
        var i = 0
        var c = 0
        while(vect[i]!=null)
        {
            while(vect[c]!=null)
            {
                if(vect[c+1]!=null)
                {
                    if(vect[c]["pages_read"] < vect[c+1]["pages_read"])
                    {
                        let a = vect[c]["pages_read"]
                        let b = vect[c]["username"]
                        vect[c]["pages_read"] = vect[c+1]["pages_read"]
                        vect[c]["username"] = vect[c+1]["username"]
                        vect[c+1]["username"] = b
                        vect[c+1]["pages_read"] = a
                    }
                }
                c=c+1
            }
            i = i+1
        }
        i=0;
        while(vect[i] != null && i != 10)
        {
            rank_div.innerHTML += '<div class="row"><div class="col"><h3>'+vect[i]["username"]+'</h3></div><div class="col"><h3>'+vect[i]["pages_read"]+'</h3></div></div>';
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
     function searchForUser(username)
     {
        console.log(username)
        console.log(data.Users)
        const v = data.Users
        let i = 0
        while(v[i]!=null)
        {
            if(v[i]["username"]==username)
            {
                return;
            }
            i = i+1
        }
        return;
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
                    setJoin(response.data.isIn == true ? true:false);
                    setLoad(true);
                 })
                 .catch(error => console.error('Errore nella richiesta POST:', error));
    }
    useEffect(() => { call()
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
        setJoin(!isJoin);
        /*if(isJoin == false)
        {
            data.Users[usernameToAdd]=0;
        }
        else
        {
            delete(data.Users[usernameToAdd])
        }*/
        rankPosition();
        BuildRank();
    }
    function rankPosition()
    {
        searchForUser(usernameToAdd)
        const keys = data.Users
        var i = 0;
        while(keys[i] != null)
        {
            if(keys[i]["username"] === usernameToAdd)
            {
                i = i+1;
                var result = "You are in " + i + " position !";
                console.log("ciaeo")
                return result
            }
            else
            {
                i = i+1;
            }

        }
        console.log("ciao")
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
            {load ? BuildRank() : "not loaded"}
            <div id="rank"></div>
        </Row>
        <Row>
            {load ?(isJoin ? <h4>{rankPosition()}</h4> : <h4>You do not partecipate in the competition</h4>):"still not loaded"}
        </Row>
        <Row>
            <Button onClick={()=>{joinCompetition(data.name)}}> {givename()} </Button>
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