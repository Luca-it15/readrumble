import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
function UserAdmin() {
    const navigate = useNavigate();
    function goProfile(_id)
    {
        navigate("/admin/user/banunban/"+_id);
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
        <>
            <Row>
            <h1>This is the admin page to ban and unban people</h1>
            </Row>
            <Row>

                {listUser.map(item =>(
                    <Row>
                        <Button className = "buttonBan" onClick={()=>{goProfile(item._id)}}>{item._id}</Button>
                    </Row>
                ))}

            </Row>
        </>
    ); 
}
export default UserAdmin;