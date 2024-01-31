import React, {useState, useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import {Container, Grid, Typography, Paper, Card, Link} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../App.css'
import {blue, red} from "@mui/material/colors";
import Button from "@mui/material-next/Button";
import GoBack from "./GoBack";

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
        variant: 'success',
    });
    const [deleteStatus, setDeleteStatus] = useState({
        message: '',
        variant: 'success',
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
        axios.post("http://localhost:8080/api/competition/joinleave", {
            username: usernameToAdd,
            competitionTitle: Name,
            competitionTag: Tag
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
        {backgroundImage: 'linear-gradient(to right bottom, rgba(255, 215, 0, 0.5), rgba(175, 145, 0, 0.65))'}, // #FFD700
        {backgroundImage: 'linear-gradient(to left top, rgba(192, 192, 192, 0.6), rgba(132, 132, 132, 0.6))'}, // #C0C0C0
        {backgroundImage: 'linear-gradient(to right top, rgba(205, 127, 50, 0.4), rgba(185, 107, 30, 0.6))'}, // #cd7f32
        {backgroundColor: 'rgba(255, 255, 255, 1)'}
    ]

    function seeProfile(username) {
        if (username === JSON.parse(localStorage.getItem('logged_user'))["_id"]) {
            navigate("/profile")
        } else {
            navigate(`/user/${username}`)
        }
    }

    function deleteCompetition(Name) {
        const response = axios.post("http://localhost:8080/api/admin/competition/delete", {CompName: Name})
            .then(response => {
                setDeleteStatus({message: response.data, variant: 'success'});
            })

        setTimeout(function () {
            setDeleteStatus({message: "", variant: 'success'});
        }, 1000);

        navigate("/admin_competition")
    }

    return (
        <Container>
            <Paper elevation={2} style={PaperStyle}>
                <Grid item>
                    <Card sx={CardStyle} elevation={0}>
                        <Grid container item direction="row" alignItems="center" justifyContent="space-around">
                            <Grid item xs={1}>
                                <GoBack/>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography sx={{marginRight: '150px'}} variant="h4">{data.name}</Typography>
                                <Typography sx={{marginRight: '150px'}} variant="h5">Tag: {data.tag}</Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid container direction="column" spacing={2} alignItems="center" justifyContent="space-around">
                    <Grid item xs={12} sx={{margin: '30px 0px 0px 0px'}}><Typography variant="h5">Top ten</Typography>
                        <Grid container direction="column" spacing={2} alignItems="center" justifyContent="center"
                              sx={{margin: '10px 0px 5px 0px', padding: '0px'}}>
                            {rank.map(item => (
                                <React.Fragment>
                                    <Grid container item xs={12} direction="row" justifyContent="space-between"
                                          sx={{
                                              backgroundColor: colors[(rank.indexOf(item) > 2) ? 3 : (rank.indexOf(item))],
                                              margin: '10px',
                                              borderRadius: 8,
                                              paddingBottom: '0px',
                                              width: rank.indexOf(item) in [0, 1, 2] ? '450px' : '400px'
                                          }}>
                                        <Grid item xs={2}>
                                            <Typography
                                                sx={{fontSize: rank.indexOf(item) in [0, 1, 2] ? '18px' : '16px'}}>
                                                {rank.indexOf(item) + 1}°</Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            {JSON.parse(localStorage.getItem('isAdmin')) != 1 ? (
                                                <Link onClick={() => {
                                                     seeProfile(item.username)
                                                }} sx={{
                                                    color: "#000000",
                                                    '&:hover': {cursor: 'pointer'}
                                                }}>
                                                    <Typography
                                                        sx={{fontSize: rank.indexOf(item) in [0, 1, 2] ? '18px' : '16px'}}>
                                                        {item.username}
                                                    </Typography>
                                                </Link>
                                            ) : (
                                                <Typography
                                                    sx={{fontSize: rank.indexOf(item) in [0, 1, 2] ? '18px' : '16px'}}>
                                                    {item.username}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography
                                                sx={{fontSize: rank.indexOf(item) in [0, 1, 2] ? '18px' : '16px'}}>
                                                {item.tot_pages}</Typography>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                {JSON.parse(localStorage.getItem('isAdmin')) == 1 ? (
                    <React.Fragment>
                        <Button variant="filledTonal" sx={{backgroundColor: red[200],
                            margin: '10px', '&:hover': {backgroundColor: red[100]}
                        }} onClick={() => {deleteCompetition(data.name)}}>
                            <Typography>Delete this competition</Typography>
                        </Button>

                        {deleteStatus.message && (
                            <Alert variant={deleteStatus.variant}>
                                {deleteStatus.message}
                            </Alert>
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {points != null ? (
                            <Grid>
                                <Typography variant="h5">Your pages read: {points}</Typography>
                            </Grid>
                        ) : (
                            <Grid>
                                <Typography variant="h5">You are not participating in this competition</Typography>
                            </Grid>
                        )}

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
                    </React.Fragment>
                )}
                <Grid>
                    <Button variant="filledTonal" sx={{
                        backgroundColor: blue[500], color: '#ffffff',
                        margin: '10px', '&:hover': {backgroundColor: blue[300]}
                    }} onClick={() => {
                        navigate(JSON.parse(localStorage.getItem('isAdmin')) == 1 ? "/admin_competition" : "/competitions")
                    }}>
                        <Typography variant="h5">More competitions</Typography>
                    </Button>
                </Grid>
            </Paper>
        </Container>

    )
}

export default CompetitionSpec;