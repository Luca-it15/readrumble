import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue} from "@mui/material/colors";

function UserListShow({username}) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/search/users/${username}}`);

            const users = response.data
            // Returns user.id and user.title
            setUsers(users.map(user => ({
                id: user.id,
            })));

        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [username]);

    const loadAllUsers = () => {
        setDisplayCount(users.length);
    };

    function seeDetails(username) {
        navigate(`/user/${username}`);
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa', padding: '10px', margin: '20px 10px 0px 10px', borderRadius: 5, width: '100%'
    }

    return (
        <Paper sx={PaperStyle}>
            <List sx={ListStyle}>
                {users.length === 0 ? (<ListItem>
                    <Typography>No users to show</Typography>
                </ListItem>) : (Array.isArray(users) && users.slice(0, displayCount).map((user, index) => (
                    <React.Fragment key={index}>
                        <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                            <Link onClick={() => {
                                seeDetails(user.id)
                            }} sx={{color: "#000000"}}>
                                <Typography>{user.id}</Typography>
                            </Link>
                        </ListItem>
                        <Divider variant="middle" component="li"/>
                    </React.Fragment>)))}
            </List>
            {users.length > displayCount && (
                <Button variant="filledTonal" onClick={loadAllUsers}
                        sx={{
                            backgroundColor: blue[100],
                            marginTop: "10px",
                            height: "30px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}>
                    <Typography>Show all</Typography>
                </Button>)}
        </Paper>
    );
}

export default UserListShow;