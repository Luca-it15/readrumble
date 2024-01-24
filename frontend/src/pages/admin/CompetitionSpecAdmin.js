import React, { useState, useEffect } from 'react';
import { Alert, Button, Row, Col } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../App.css'

function CompetitionSpecAdmin(){
        const PaperStyle = {
                    backgroundColor: '#f1f7fa',
                    padding: '10px',
                    margin: '20px 10px 0px 10px',
                    borderRadius: 18,
                    width: '100%',
                    textAlign:'center'
                }
    const [load,setLoad] = useState(false);
    var isJoined = false;
    const { name } = useParams();
    const navigate = useNavigate();
    const [rank,setRank] = useState('');
    const [deleteStatus, setDeleteStatus] = useState({
            message: '',
            variant: 'success', // o 'danger' in caso di errore
    });
    const [data, setData] = useState([]);
    const [isJoin, setJoin] = useState();
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["Username"];


    function setThings(value)
    {
        setRank(value.rank)
        setJoin(value.isIn === "YES" ? true:false);
        setLoad(true);
    }
    function call()
    {
        axios.post('http://localhost:8080/api/competition/getcompinfo',{
                CompetitionTitle: name,
                Username: usernameToAdd
                })
                .then(response => {
                    setData(response.data);
                    setThings(response.data);
                 })
                 .catch(error => console.error('Errore nella richiesta POST:', error));
    }
    useEffect(() => { call()
        }, []);    // [] means "Execute this action just at the start of the page"

    function deleteCompetition(Name){

        const response = axios.post("http://localhost:8080/api/admin/competition/delete",{
        CompName: Name
        })
        .then(response => {
                    setDeleteStatus({message:response.data,variant:'success'});
        })
        setTimeout(function () {setDeleteStatus({message:"",variant:'success'});},4000);
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
                    {load ? (rank.map(item => (
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
                    ))):"Not Loaded"}
                  </Row>
                  <Row>
                    <Paper elevation={2} style={PaperStyle} onClick={()=>{deleteCompetition(data.name)}}>
                        <Typography variant="h5">Delete Competition</Typography>
                    </Paper>
                  </Row>
                    <Row>
                        {deleteStatus.message && (
                            <Alert variant={deleteStatus.variant}>
                                {deleteStatus.message}
                            </Alert>
                        )}
                    </Row>
                  <Row>
                        <Paper elevation={2} style={PaperStyle} onClick={()=>{navigate("/admin_competition")}}>
                                <Typography variant="h5">Back to Competitions</Typography>
                        </Paper>
                  </Row>
        </Container>
    )
}

export default CompetitionSpecAdmin;
