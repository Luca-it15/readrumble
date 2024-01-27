import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import {CardContent} from '@mui/material';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        axios.get(`http://localhost:8080/api/user/all`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <Container>
            {users.map((user) => (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Username {user.id}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
}

export default UserList;
