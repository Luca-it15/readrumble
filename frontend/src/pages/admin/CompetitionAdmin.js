import React, {useState, useEffect} from 'react';
import {Row, Form, Col} from 'react-bootstrap';
import {Container, Grid, Typography, Paper} from '@mui/material';
import axios from 'axios';
import '../../App.css';
import {useNavigate} from 'react-router-dom';
import {blue} from "@mui/material/colors";
import Button from "@mui/material-next/Button";
import TextField from "@mui/material/TextField";

function CompetitionAdmin() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const [data, setData] = useState([]);
    const [dataForBuild, setDataForBuild] = useState([]);
    const [isLoad, SIL] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        searchBar: ''
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        let dataModified = data.filter(obj => obj.name.includes(value));
        setDataForBuild(dataModified);
        ListCreator();
    };

    const goSpecificComp = (Name) => {
        navigate("/competition/" + Name);
    }

    useEffect(() => {
        axios.get('http://localhost:8080/api/competition/retrieve/all')
            .then(response => {
                const jsonData = response.data.map(document => JSON.parse(JSON.stringify(document)));

                setData(jsonData);
                setDataForBuild(jsonData);

                SIL(true);
            })
            .catch(error => console.error('Errore nella richiesta GET:', error));
    }, []);

    function ListCreator() {
        return (
            dataForBuild.map(item => (
                <React.Fragment>
                    <Grid item xs={4}>
                        <Paper sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 8,
                            margin: '10px 10px 10px 10px',
                            padding: '10px',
                            '&:hover': {boxShadow: '0px 3px 8px 0px rgba(0,0,0,0.2)', margin: '5px 10px 15px 10px'}
                        }} elevation={0}>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography sx={{color: '#888888'}}>Tag: {item.tag}</Typography>
                            <Button variant="filledTonal" sx={{
                                marginTop: '10px', backgroundColor: blue[200], padding: '5px 15px',
                                '&:hover': {backgroundColor: blue[100]}
                            }} onClick={() => {
                                goSpecificComp(item.name)
                            }}>
                                <Typography>See details</Typography>
                            </Button>
                        </Paper>
                    </Grid>
                </React.Fragment>
            ))
        )
    }

    const searchBar = {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: '10px',
        fontSize: '18pt',
        padding: '5px 10px',
        width: '25vw',
    }

    return (
        <Container>
            <Paper elevation={2} style={PaperStyle}>
                <Grid container direction="column" textAlign="center" alignItems="center" justifyContent="space-evenly">
                    <Grid item>
                        <Typography variant="h5" sx={{margin: '10px'}}>Ongoing competitions</Typography>
                    </Grid>
                </Grid>
                <Grid container direction="row" alignItems="center" justifyContent="center" sx={{gap:'20px', marginTop: '10px'}}>
                    <Typography variant="h6">Find competition:</Typography>
                    <TextField type="text" name="searchBar" placeholder="Search" variant="standard" sx={searchBar}
                                           onChange={handleChange}/>
                    <Button onClick={() => {navigate("/admin_competition/add_comp")}} variant="filledTonal"
                            sx={{color: '#ffffff', backgroundColor: blue[400], height: "40px",
                                '&:hover': {backgroundColor: blue[300]}}}>
                        <Typography>Add competition</Typography>
                    </Button>
                </Grid>
                <Grid container direction="row" alignItems="center" justifyContent="center">
                        {isLoad ? ListCreator() : "Empty list"}
                </Grid>
            </Paper>
        </Container>
    )


}

export default CompetitionAdmin;