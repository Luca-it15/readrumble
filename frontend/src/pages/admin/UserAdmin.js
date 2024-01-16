import React, { useState, useEffect } from 'react';
import { Alert, Form, Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
function UserAdmin() {
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
        if(_id=='')
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
        <Container className="defCont">
            <Row>
            <h1>This is the admin page to ban and unban people</h1>
            </Row>
            <Row>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label><h2>Search User</h2></Form.Label>
                        <Form.Control type="text" name="_id" placeholder="Username" onChange={handleChange}/>
                    </Form.Group>
                </Form>
            </Row>
            <Row>
                <Button onClick={()=>{goProfile(usernameId)}}>Search</Button>
            </Row>
            <Row>
                {searchVal.message && (
                                <Alert severity={searchVal.variant}>
                                    {searchVal.message}
                                </Alert>
                            )}
            </Row>
            <Row>
                <h2>List of Banned User</h2>
            </Row>
            <Row>

                {listUser.map(item =>(
                    <Row>
                        <Button className = "buttonBan" onClick={()=>{goProfile(item._id)}}>{item._id}</Button>
                    </Row>
                ))}

            </Row>
        </Container>
    ); 
}
export default UserAdmin;