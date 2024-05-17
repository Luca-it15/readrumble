import React, {useState, useEffect} from 'react';
import Button from '@mui/material-next/Button';
import {Grid, Typography, Paper, Link, ListItem, List, Divider} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import {blue, red} from "@mui/material/colors";
import axios from "axios";

function CompetitionProfBlock(user) {
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
        if (currentUser['_id'] === user && currentUser['competitions'] !== undefined) {
            setCompetitions(currentUser['competitions'])

        } else if(user.competitionsInfo !== undefined) {
            console.log(user.competitionsInfo); 
            console.log(user.user)
            let competitionInfo = user.competitionsInfo.map(
                competition => ({
                        competition_name: competition.competition_name,
                        tot_pages: competition.tot_pages
                    }
                ));
            setCompetitions(competitionInfo)
        } else {
            let username = user.user; 
            axios.get(`http://localhost:8080/api/competition/joinedBy/${username}`)
                .then(response => {
                    console.log(response.data)
                    let competitions = response.data.map(
                        competition => ({
                                competition_name: competition.name,
                                tot_pages: competition.pages
                            }
                        ));

                    setCompetitions(competitions)
                })
                .catch(error => console.error('Error: ', error));
        }
    }

    useEffect(() => {
        drawComp();
    }, [user.competitionsInfo]);

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
                                <Typography>{currentUser['_id'] === user.user ? "You are " : user.user + " is "}
                                    not participating in any competition</Typography>
                            </ListItem>
                        </Grid>)}
                    {competitions.slice(0, displayCount).map(item => (
                        <Grid item>
                            <ListItem sx={{'&:hover': {backgroundColor: '#f1f7fa', borderRadius: '30px'}}}
                                      secondaryAction={
                                          <Typography sx={{color: '#888888', fontSize: '10pt', marginTop: '2px'}}>
                                              pages: {item.tot_pages}
                                          </Typography>
                                      }>
                                <Link onClick={() => {
                                    goSpecificComp(item.competition_name)
                                }}
                                      sx={{color: '#000000', marginRight: '30px', '&:hover': {cursor: 'pointer'}}}>
                                    <Typography>{item.competition_name}</Typography>
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
