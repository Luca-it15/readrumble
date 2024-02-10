import React, {useState, useEffect} from 'react';
import {Container, Grid, Typography, Paper, Alert, ListItem, List} from '@mui/material';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
import Button from "@mui/material-next/Button";
import {blue} from "@mui/material/colors";
import {SearchRounded} from "@mui/icons-material";
import TextField from "@mui/material/TextField";

function UserAdmin() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        "width": "50%",
        "position": "relative",
        "left": "25%",
        borderRadius: 18,
        textAlign: 'center'
    }

    const PaperStyle1 = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        width: '100%',
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

    const navigate = useNavigate();
    const [usernameId, setUsernameId] = useState([]);
    const [searchVal, setSearchVal] = useState({
        message: '',
        validation: 'success'
    });

    function searchResp() {
        const searchResponse = localStorage.getItem("admin_search_response")
        if (searchResponse) {
            setSearchVal({message: "The searched username doesn't exists", variant: 'error'})
            setTimeout(() => {
                setSearchVal({message: "", validation: 'success'});
                localStorage.removeItem("admin_search_response");
            }, 2500)
        }

    }

    useEffect(() => {
        searchResp()
    }, []);

    function handleChange(e) {
        const {value} = e.target;
        setUsernameId(value);
    }

    function goProfile(_id) {
        if (_id === '') {
            setSearchVal({message: "The searched username doesn't exists", variant: 'error'})
            setTimeout(() => {
                setSearchVal({message: "", validation: 'success'});
            }, 3000)
        } else {
            navigate("/admin/user/banunban/" + _id);
        }
    }

    const [listUser, setListUser] = useState([]);

    function getBannedUser() {
        axios.get("http://localhost:8080/api/admin/user/all_banned_users")
            .then(response => {
                    const JsonData = response.data.map(doc => JSON.parse(JSON.stringify(doc)));
                    setListUser(JsonData);
                }
            ).catch(error => console.error("We Caught an exception and this is the error : ", error));
    }

    useEffect(() => {
        getBannedUser()
    }, [])

    const searchBar = {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: '10px',
        fontSize: '18pt',
        padding: '5px 10px',
        width: '25vw',
    }

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    return (
        <Container>
            <Paper style={PaperStyle1}>
                <Typography variant="h5" sx={{marginBottom: '20px'}}>Ban or unban readers</Typography>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h6">Find a reader:</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField type="text" name="_id" placeholder="Username" variant="standard"
                                   onChange={handleChange} sx={searchBar}/>
                    </Grid>
                    <Grid item>
                        <Button sx={{backgroundColor: blue[400], borderRadius: 10, height: '35px',
                            width: '35px', textAlign: 'center', '&:hover': {backgroundColor: blue[300]}
                        }} onClick={() => {goProfile(usernameId)}}>
                            <SearchRounded sx={{color: '#ffffff'}}/>
                        </Button>
                    </Grid>
                </Grid>

                {searchVal.message && (
                    <Alert severity={searchVal.variant}>
                        {searchVal.message}
                    </Alert>
                )}
                <Paper elevation={2} style={PaperStyle}>
                    <Typography variant="h5">Banned users:</Typography>

                    <List sx={ListStyle}>
                        {listUser.length === 0 ? (
                            <ListItem>
                                <Typography>No banned users</Typography>
                            </ListItem>
                        ) : (
                            listUser.map(item => (
                                    <ListItem key={item._id} sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                        <Typography>{item._id}</Typography>
                                    </ListItem>
                            ))
                        )}
                    </List>

                </Paper>

            </Paper>
        </Container>
    );
}

export default UserAdmin;