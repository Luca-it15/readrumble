import React, {useEffect, useState} from 'react';
import {Container, Grid, Typography, Paper, Card, ListItem, List, Divider, Switch} from '@mui/material';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Bar, Line} from "react-chartjs-2";

const DashboardAdmin = () => {
    let currentUser = localStorage.getItem('logged_user');

    const navigate = useNavigate();

    if (!currentUser) {
        navigate("/login");
    }

    const [toggle, setToggle] = useState('byTag');
    const [avgPagesByTagData, setAvgPagesByTagData] = useState([]);
    const [avgPagesByTagByMonthData, setAvgPagesByTagByMonthData] = useState([]);

    async function fetchAvgByTag() {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/competition/analytic/pagesByTag`);

            console.log("Avg pages by tag: ", response.data);

            // Convert the object to an array of objects
            let data = Object.entries(response.data).map(([tag, pages]) => ({tag, pages}));

            setAvgPagesByTagData(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    async function fetchAvgByTagMonth() {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/competition/analytic/pagesByMonthAndTag`);
            console.log("Avg pages by tag and month: ", response.data);

            // Convert the object to an array of objects
            let data = Object.entries(response.data).map(([month, tags]) => ({month: Number(month), tags}));

            // Sort the data by month considering the circular nature of months
            const date = new Date();
            const currentMonth = date.getMonth() + 1;

            data.sort((a, b) => {
                const adjustedAMonth = a.month <= currentMonth ? a.month + 12 : a.month;
                const adjustedBMonth = b.month <= currentMonth ? b.month + 12 : b.month;
                return adjustedAMonth - adjustedBMonth;
            });

            setAvgPagesByTagByMonthData(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchAvgByTag();
    }, [currentUser['_id']]);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%',
        textAlign: 'center'
    }

    const avgPagesByTagRankpart1 = avgPagesByTagData
        .sort((a, b) => a.pages - b.pages).slice(0, 8)
        .map((data, index) => (
            <React.Fragment>
                <ListItem key={index} sx={{backGroundColor: '#ffffff', '&:hover': {backgroundColor: "#f1f7fa"}}}>
                    <strong>#{index + 1}</strong> {'. ' + data.tag}: {data.pages} pages
                </ListItem>
                <Divider variant="middle" component="li"/>
            </React.Fragment>
        ));

    const avgPagesByTagRankpart2 = avgPagesByTagData
    .sort((a, b) => a.pages - b.pages).slice(8, 17)
    .map((data, index) => (
        <React.Fragment>
            <ListItem key={index} sx={{backGroundColor: '#ffffff', '&:hover': {backgroundColor: "#f1f7fa"}}}>
                <strong>#{index + 9}</strong> {'. ' + data.tag}: {data.pages} pages
            </ListItem>
            <Divider variant="middle" component="li"/>
        </React.Fragment>
    ));

    const tags = ["Non-fiction", "Graphic", "Romance", "History", "Paranormal", "Young-adult", "Thriller", "Crime", "Fantasy", "Biography", "Poetry", "Mystery", "Children", "Comics", "Fiction", "Historical fiction"];

    const colors = [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
        '#f58231', '#911eb4', '#f032e6', '#fabebe',
        '#008080', '#e6beff', '#9a6324', '#800000',
        '#d5a97e', '#000075', '#808080', '#000000'
    ]

    const datasets = tags.map((tag, index) => ({
        label: tag,
        data: avgPagesByTagByMonthData.map((data) => data.tags[tag] || 0),
        fill: false,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        tension: 0.3
    }));

    const avgPagesByTagByMonthChart = (
        <div style={{height: '60vh'}}>
            <Line
                data={{
                    labels: avgPagesByTagByMonthData.map((data) => data.month),
                    datasets: datasets
                }}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                }}
            />
        </div>
    );

    const avgPagesByTagChart = (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Bar
            data={{
                labels: avgPagesByTagData.map((data) => data.tag).sort((a, b) => a.localeCompare(b)),
                datasets: [
                    {
                        label: 'Average pages read',
                        data: avgPagesByTagData.sort((a, b) => a.tag.localeCompare(b.tag)).map((data) => data.pages),                        backgroundColor: 'rgba(75,192,192,0.41)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 0,
                        borderRadius: 10,
                    },
                ],
            }}
            options={{
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }}
        />
        </div>
    );

    const ListStyle = {
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#ffffff',
    };

    return (
        <Container maxWidth="xl">
            <Grid container direction="row" justifyContent="space-around">
                <Grid item xs={6}>
                    <Paper sx={PaperStyle}>
                        <Typography variant="h5" textAlign="center">Dashboard</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper elevation={2} style={PaperStyle}>
                <Grid container item xs={12} spacing={2} direction="row" justifyContent="space-around" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5">Competitions</Typography>
                    </Grid>
                    <Grid container item xs={12} direction="column" spacing={2}>
                        <Grid container item direction="row" justifyContent="center" alignItems="center">
                            <Grid item>
                                <Typography>by tag</Typography>
                            </Grid>
                            <Grid item>
                                <Switch color="primary" value={toggle} onChange={() => {
                                    setToggle(toggle === 'byTag' ? 'byMonthAndTag' : 'byTag');
                                    if (toggle === 'byTag') {
                                        fetchAvgByTagMonth();
                                    } else {
                                        fetchAvgByTag();
                                    }
                                }}/>
                            </Grid>
                            <Grid item>
                                <Typography>by month and tag</Typography>
                            </Grid>
                        </Grid>

                        {toggle === 'byMonthAndTag' ? (
                            <Grid item xs={12}>
                                <Card sx={{padding: '10px', borderRadius: 5}}>
                                    <>
                                        {avgPagesByTagByMonthChart}
                                    </>
                                </Card>
                            </Grid>
                        ) : (
                            <Grid container item direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                <Grid item xs={6.5}>
                                    <Card sx={{padding: '10px', borderRadius: 5}}>
                                        <>
                                            {avgPagesByTagChart}
                                        </>
                                    </Card>
                                </Grid>
                                <Grid item xs={5.5}>
                                    <Card sx={{ padding: '10px', borderRadius: 5, backgroundColor: '#f1f7fa' }}>
                                        <Typography variant="h5">Least participated and average top 10s points, last six months</Typography>
                                        <Grid container item direction="row" justifyContent="center" alignItems="center" spacing={3}>
                                            <Grid item xs={6}>
                                                <List sx={ListStyle}>{avgPagesByTagRankpart1}</List>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <List sx={ListStyle}>{avgPagesByTagRankpart2}</List>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default DashboardAdmin;