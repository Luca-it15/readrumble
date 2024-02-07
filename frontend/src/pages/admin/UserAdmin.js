import React, { useState, useEffect } from 'react';
import {Form ,Row} from 'react-bootstrap';
import {Container, Grid, Typography, Paper, Alert} from '@mui/material';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
function UserAdmin() {
    const PaperStyle = {
                backgroundColor: '#f1f7fa',
                padding: '10px',
                margin: '20px 10px 0px 10px',
                "width":"50%",
                "position":"relative",
                "left":"25%",
                borderRadius: 18,
                textAlign: 'center'
            }
        const PaperStyle1 = {
                    backgroundColor: '#f1f7fa',
                    padding: '10px',
                    width:'100%',
                    margin: '20px 10px 0px 10px',
                    borderRadius: 18,
                    textAlign: 'center'
                }
    const PaperStyleSearch = {
            backgroundColor: 'cornflowerblue',
            color: "white",
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            textAlign: 'center',
            transition: 'background-color 0.3s ease'
        }
    const PaperStyleSearchHover = {
            backgroundColor: 'cadetblue',
            color: "white",
            padding: '10px',
            margin: '20px 10px 0px 10px',
            borderRadius: 18,
            textAlign: 'center',
            transition: 'background-color 0.3s ease'
        }
    const navigate = useNavigate();
    const[searchStyle,setSearchStyle] = useState(PaperStyleSearch)
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
            setSearchVal({message:"The searched username doesn't exists", variant:'error'})
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
        if(_id=='')
        {
            setSearchVal({message:"The searched username doesn't exists", variant:'error'})
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
        <Paper style = {PaperStyle1}>
                    <Typography variant="h3">Ban or Unban Readers</Typography>
                <Paper elevation={2} style={PaperStyle}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label><Typography variant="h4">Enter the username of the reader to search</Typography></Form.Label>
                            <Form.Control type="text" name="_id" placeholder="Username" onChange={handleChange}/>
                        </Form.Group>
                    </Form>
                    <Paper elevation={2} style={searchStyle} onClick={()=>{goProfile(usernameId)}} onMouseEnter={() => setSearchStyle(PaperStyleSearchHover)} onMouseLeave={() => setSearchStyle(PaperStyleSearch)}>
                        <Typography variant="h4">Search user</Typography>
                    </Paper>
                </Paper>

                {searchVal.message && (
                    <Alert severity={searchVal.variant}>
                        {searchVal.message}
                    </Alert>
                )}
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h4">List of Banned User</Typography>

                {listUser.map(item =>(
                        <Paper elevation={2} style={PaperStyle} onClick={()=>{goProfile(item._id)}}>
                            <Typography variant="h5">{item._id}</Typography>
                        </Paper>
                ))}
                </Paper>

        </Paper>
        </Container>
    ); 
}
export default UserAdmin;