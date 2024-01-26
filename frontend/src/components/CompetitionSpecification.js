import React, {useState, useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import {Container, Grid, Typography, Paper, Card} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../App.css'
import {blue, red} from "@mui/material/colors";
import Button from "@mui/material-next/Button";

function CompetitionSpec() {
    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        paddingRight: '28px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const {name} = useParams();
    const navigate = useNavigate();
    const [joinStatus, setJoinStatus] = useState({
        message: '',
        variant: 'success', // o 'danger' in caso di errore
    });
    const [data, setData] = useState([]);
    const [rank, setRank] = useState([])
    const [isJoin, setJoin] = useState(false);
    const [points, setPoints] = useState(null);
    const username = JSON.parse(localStorage.getItem('logged_user'));
    var usernameToAdd = username["_id"];

    function searchForUser(value) {
        setRank(value.rank);

        const comp = username["competitions"];

        let i = 0;

        while (comp[i] != null) {
            if (comp[i].name === value.name) {
                setJoin(true);
                setPoints(comp[i].pages);

                const rankTwo = value.rank

                let c = 0

                while (c < 10) {
                    if (rankTwo[c].tot_pages <= comp[i].pages) {
                        rankTwo[c].tot_pages = comp[i].pages;
                        rankTwo[c].username = usernameToAdd;
                        setRank(rankTwo);
                        return
                    }
                    c = c + 1;
                }
                return;
            }
            i = i + 1;
        }
        setJoin(false);
    }

    function call() {
        axios.post('http://localhost:8080/api/competition/getcompinfo', {
            CompetitionTitle: name
        }).then(response => {
            setData(response.data);
            searchForUser(response.data);
        }).catch(error => console.error('Errore nella richiesta POST:', error));
    }

    useEffect(() => {
        call()
    }, []);

    function joinCompetition(Name, Tag) {
        const response = axios.post("http://localhost:8080/api/competition/join", {
            parametro1: usernameToAdd,
            parametro2: Name,
            parametro3: Tag
        }).then(response => {
            setJoinStatus({message: response.data, variant: 'success'});
        })

        setTimeout(function () {
            setJoinStatus({message: "", variant: 'success'});
        }, 4000);

        setJoin(!isJoin);

        if (points == null) {
            setPoints(0);
            let k = 0;

            while (username.competitions[k] != null) {
                k = k + 1;
            }

            var new_comp = {
                name: Name,
                tag: Tag,
                pages: 0
            }

            username["competitions"].push(new_comp)
            localStorage.setItem('logged_user', JSON.stringify(username));
        } else {
            var new_local = username
            let i = 0
            while (new_local.competitions[i] != null) {
                if (new_local.competitions[i].name === Name) {
                    new_local.competitions.splice(i, 1);
                    localStorage.setItem('logged_user', JSON.stringify(new_local));
                }
                i = i + 1;
            }
            setPoints(null);
        }
    }

    const CardStyle = {
        backgroundColor: '#ffffff',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const colors = [
        'rgba(255, 215, 0, 0.4)', // #FFD700
        'rgba(192, 192, 192, 0.4)', // #C0C0C0
        'rgba(205, 127, 50, 0.4)', // #cd7f32
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)'
    ]

    return (
        <Container>
            <Paper elevation={2} style={PaperStyle}>
                <Grid item>
                    <Card sx={CardStyle} elevation={0}>
                        <Typography variant="h4">{data.name}</Typography>
                        <Typography variant="h5">Tag: {data.tag}</Typography>
                    </Card>
                </Grid>
                <Grid container direction="column" spacing={2} alignItems="center" justifyContent="space-around">
                    <Grid item xs={12} sx={{margin:'30px 0px 0px 0px'}}><Typography variant="h5">Top ten</Typography>
                        <Grid container direction="column" spacing={2} alignItems="center" justifyContent="space-around"
                            sx={{marginTop: '10px'}}>
                            {rank.map(item => (
                                <React.Fragment>
                                    <Grid container item xs={12} direction="row" justifyContent="space-between"
                                          sx={{
                                              backgroundColor: colors[rank.indexOf(item)],
                                              margin: '10px',
                                              borderRadius: 8,
                                              paddingBottom: '10px',
                                              width: '400px'
                                          }}>
                                        <Grid item xs={5}>
                                            <Typography>{item.username}</Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Typography>{item.tot_pages}</Typography>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    {points != null ? (
                        <Button variant="filledTonal" sx={{
                            backgroundColor: red[200],
                            margin: '10px', '&:hover': {backgroundColor: red[100]}
                        }} onClick={() => {
                            joinCompetition(data.name, data.tag)
                        }}>
                            <Typography>Leave this competition</Typography>
                        </Button>
                    ) : (
                        <Button variant="filledTonal" sx={{
                            backgroundColor: blue[200],
                            margin: '10px', '&:hover': {backgroundColor: blue[100]}
                        }} onClick={() => {
                            joinCompetition(data.name, data.tag)
                        }}>
                            <Typography>Join this competition</Typography>
                        </Button>
                    )}
                </Grid>
                <Grid>
                    {joinStatus.message && (
                        <Alert variant={joinStatus.variant}>
                            {joinStatus.message}
                        </Alert>
                    )}
                </Grid>
                <Grid>
                    <Button variant="filledTonal" sx={{
                        backgroundColor: blue[500], color: '#ffffff',
                        margin: '10px', '&:hover': {backgroundColor: blue[300]}
                    }} onClick={() => {
                        navigate("/competitions")
                    }}>
                        <Typography variant="h5">More competitions</Typography>
                    </Button>
                </Grid>
            </Paper>
        </Container>

    )
}

export default CompetitionSpec;