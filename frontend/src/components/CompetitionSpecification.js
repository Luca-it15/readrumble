import React, { useState, useEffect } from 'react';
import { Alert, Button, Row, Col } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../App.css'

function CompetitionSpec(){
    const PaperStyle = {
            backgroundColor: '#f1f7fa',
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            width: '100%',
            textAlign:'center'
        }
        const ButtonStyle = {
            color: 'cadetblue'
        }
    //this is the block that contains the rank, your points, the name of the comp and the tag
    //adesso devo fare in modo di far vedere il punteggio dell'utente se sta partecipando a tale competizione
    //facendo un controllo sul nome competizione
    const [load,setLoad] = useState(false);
    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [joinStatus, setJoinStatus] = useState({
            message: '',
            variant: 'success', // o 'danger' in caso di errore
    });
    const [data, setData] = useState([]);
    const [rank, setRank] = useState([])
    const [isJoin, setJoin] = useState(false);
    const [points, setPoints] = useState(null);
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["_id"];

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

    function searchForUser(value)
    {
        setRank(value.rank);
        const comp = username["competitions"];
        let i = 0;
        while(comp[i] != null)
        {
            if(comp[i].name == value.name)
            {
                setJoin(true);
                setPoints(comp[i].pages);
                const rankTwo = value.rank
                let c = 0
                while(c < 10)
                {
                    if(rankTwo[c].tot_pages <= comp[i].pages)
                    {
                        rankTwo[c].tot_pages = comp[i].pages;
                        rankTwo[c].username = usernameToAdd;
                        setRank(rankTwo);
                        return
                    }
                    c=c+1;
                }

                return;
            }
            i=i+1;
        }
        setJoin(false);
        return;
    }
    function call()
    {
        
        axios.post('http://localhost:8080/api/competition/getcompinfo',{
                CompetitionTitle: name
                })
                .then(response => {
                    setData(response.data);
                    searchForUser(response.data);
                 })
                 .catch(error => console.error('Errore nella richiesta POST:', error));
    }
    useEffect(() => { call()
        }, []);
    function joinCompetition(Name,Tag){

        const response = axios.post("http://localhost:8080/api/competition/join",{
        parametro1: usernameToAdd,
        parametro2: Name,
        parametro3: Tag
        })
        .then(response => {
                    setJoinStatus({message:response.data,variant:'success'});
        })
        setTimeout(function () {setJoinStatus({message:"",variant:'success'});},4000);
        setJoin(!isJoin);
        if(points == null)
        {
            setPoints(0);
            let k = 0;
            while(username.competitions[k]!=null)
            {
                k=k+1;
            }
            var new_comp = {
                name:Name,
                tag:Tag,
                pages:0
            }
            username["competitions"].push(new_comp)
            localStorage.setItem('logged_user', JSON.stringify(username));
        }
        else
        {
            var new_local = username
            let i = 0
            while(new_local.competitions[i]!=null)
            {
                if(new_local.competitions[i].name == Name)
                {
                    new_local.competitions.splice(i, 1);
                    localStorage.setItem('logged_user', JSON.stringify(new_local));
                }
                i=i+1;
            }
            setPoints(null);
        }
    }
    return(
    <Container>
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h2" >{data.name}</Typography>
                </Paper>
            </Row>
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h3" >{data.tag}</Typography>
                </Paper>
            </Row>
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h4" >TOP TEN</Typography>
                </Paper>
            </Row>
              <Row>
                {rank.map(item => (
                    <Row>
                        <Col>
                            <Paper elevation={2} style={PaperStyle}>
                                <Typography variant="h5" >{item.username}</Typography>
                            </Paper>
                        </Col>
                        <Col>
                            <Paper elevation={2} style={PaperStyle}>
                                <Typography variant="h5" > {item.tot_pages}</Typography>
                            </Paper>
                        </Col>
                    </Row>
                ))}
              </Row>
              <Row>
                <Paper elevation={2} style={PaperStyle} onClick={()=>{joinCompetition(data.name,data.tag)}}>
                    <Typography variant="h5">{points != null ? "Your Total Pages Read : " + points : "You Do Not Partecipate in this Competition"}</Typography>
                </Paper>
              </Row>
                <Row>
                    {joinStatus.message && (
                        <Alert variant={joinStatus.variant}>
                            {joinStatus.message}
                        </Alert>
                    )}
                </Row>
              <Row>
                    <Paper elevation={2} style={PaperStyle} onClick={()=>{navigate("/competitions")}}>
                            <Typography variant="h5">Back to Competitions</Typography>
                    </Paper>
              </Row>
    </Container>

    )
}

export default CompetitionSpec;