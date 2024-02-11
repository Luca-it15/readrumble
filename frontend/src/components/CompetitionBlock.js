import React, {useState, useEffect} from 'react';
import Button from '@mui/material-next/Button';
import {Grid, Typography, Paper, Link, ListItem, List, Divider} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import {blue, red} from "@mui/material/colors";
import axios from "axios";

function CompetitionProfBlock({user}) {
    const currentUser = JSON.parse(localStorage.getItem('logged_user'));
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();
    const [displayCount, setDisplayCount] = useState(3);

    const goComp = () => {
        navigate("/competitions");
    }

    const goSpecificComp = (Name) => {
        var dynamic_path = "/competition/" + Name;
        navigate(dynamic_path);
    }

    function drawComp() {
        if (currentUser['_id'] === user) {
            setCompetitions(currentUser['competitions'])
        } else {
            console.log("Fetching competitions for user: " + user);

            axios.get(`http://localhost:8080/api/competition/joinedBy/${user}`)
                .then(response => {
                    let competitions = response.data.map(
                        competition => ({
                                name: competition.name,
                                pages: competition.pages
                            }
                        ));

                    setCompetitions(competitions)
                })
                .catch(error => console.error('Error: ', error));
        }
    }

    useEffect(() => {
        drawComp();
    }, [user]);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        borderRadius: 5,
        width: '100%'
    }

    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        margin: '10px 0px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    return (
        <Paper sx={PaperStyle}>
            <Grid container direction="column" justifyContent="space-around">
                <Grid item><Typography variant="h5">Competitions</Typography></Grid>
                <List sx={ListStyle}>
                    {competitions.length === 0 && (
                        <Grid item>
                            <ListItem>
                                <Typography>{currentUser['_id'] === user ? "You are " : user + " is "}
                                    not participating in any competition</Typography>
                            </ListItem>
                        </Grid>)}
                    {competitions.slice(0, displayCount).map(item => (
                        <Grid item>
                            <ListItem sx={{'&:hover': {backgroundColor: '#f1f7fa', borderRadius: '30px'}}}
                                      secondaryAction={
                                          <Typography sx={{color: '#888888', fontSize: '10pt', marginTop: '2px'}}>
                                              pages: {item.pages}
                                          </Typography>
                                      }>
                                <Link onClick={() => {
                                    goSpecificComp(item.name)
                                }}
                                      sx={{color: '#000000', marginRight: '30px', '&:hover': {cursor: 'pointer'}}}>
                                    <Typography>{item.name}</Typography>
                                </Link>
                            </ListItem>
                            <Divider variant="middle" component="li"/>
                        </Grid>
                    ))}
                </List>

                <Grid item>
                    {competitions.length > displayCount && (
                        <Button variant="filledTonal" sx={{
                            backgroundColor: blue[100], marginBottom: '10px', height: '30px',
                            '&:hover': {backgroundColor: blue[100]}
                        }} onClick={() => setDisplayCount(displayCount + 3)}>
                            <Typography>Show more</Typography>
                        </Button>
                    )}
                </Grid>

                <Grid item>
                    {displayCount > 3 && (
                        <Button variant="filledTonal" sx={{
                            backgroundColor: red[100], marginBottom: '10px', height: '30px',
                            '&:hover': {backgroundColor: red[100]}
                        }} onClick={() => setDisplayCount(3)}>
                            <Typography>Show less</Typography>
                        </Button>
                    )}
                </Grid>
            </Grid>


            <Button variant="filledTonal" sx={{
                backgroundColor: blue[600], marginBottom: '10px', color: '#ffffff',
                '&:hover': {backgroundColor: blue[400]}
            }} onClick={goComp}>
                <Typography>Find other competitions</Typography>
            </Button>
        </Paper>
    );
}

export default CompetitionProfBlock;
