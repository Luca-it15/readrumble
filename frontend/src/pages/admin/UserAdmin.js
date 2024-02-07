import React, { useState, useEffect } from 'react';
import { Alert, Row, Col, Form } from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
function UserAdmin() {
    const PaperStyle = {
            backgroundColor: '#f1f7fa',
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            width: '100%',
            textAlign: 'center'
        }
    const PaperStyleSearch = {
            backgroundColor: 'cadetblue',
            color: "white",
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            width: '100%',
            textAlign: 'center'
        }
    const navigate = useNavigate();
    const[usernameId,setUsernameId] = useState([]);
    const[searchVal,setSearchVal] = useState({
        message:'',
        validation:'success'
    });

    function searchResp()
    {
        const searchResponse = localStorage.getItem("admin_search_response")
        if(searchResponse)
        {
            setSearchVal({message:"The searched username doesn't exists", validation:'error'})
            setTimeout(()=>{setSearchVal({message:"", validation:'success'});localStorage.removeItem("admin_search_response");},2500)
        }

    }
    useEffect(()=>{searchResp()},[]);
    function handleChange(e)
    {
        const {value} = e.target;
        setUsernameId(value);
    }
    function goProfile(_id)
    {
        if(_id==='')
        {
            setSearchVal({message:"The searched username doesn't exists", validation:'error'})
            setTimeout(()=>{setSearchVal({message:"", validation:'success'});},2500)
        }
        else
        {
        navigate("/admin/user/banunban/"+_id);
        }
    }
    const [listUser, setListUser] = useState([]);
    function getBannedUser()
    {
        axios.get("http://localhost:8080/api/admin/user/all_banned_users")
        .then(response => {
            const JsonData = response.data.map(doc=>JSON.parse(JSON.stringify(doc)));
            setListUser(JsonData);
        }
        ).catch(error=>console.error("We Caught an exception and this is the error : ",error));
    }
    useEffect(()=>{getBannedUser()},[])
    return (
        <Container>
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h2">This is the admin page to ban and unban people</Typography>
                </Paper>
            </Row>
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label><Typography variant="h4">Enter the username of the user to search</Typography></Form.Label>
                            <Form.Control type="text" name="_id" placeholder="Username" onChange={handleChange}/>
                        </Form.Group>
                    </Form>
                    <Paper elevation={2} style={PaperStyleSearch} onClick={()=>{goProfile(usernameId)}}>
                        <Typography variant="h4">Search user</Typography>
                    </Paper>
                </Paper>
            </Row>
            <Row>
                {searchVal.message && (
                    <Alert severity={searchVal.variant}>
                        {searchVal.message}
                    </Alert>
                )}
            </Row>
            <Row>
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h4">List of Banned User</Typography>
                </Paper>
            </Row>
            <Row>
                {listUser.map(item =>(
                    <Row>
                        <Paper elevation={2} style={PaperStyle} onClick={()=>{goProfile(item._id)}}>
                            <Typography variant="h5">{item._id}</Typography>
                        </Paper>
                    </Row>
                ))}
            </Row>
        </Container>
    ); 
}
export default UserAdmin;