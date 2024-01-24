import React, {useEffect, useState} from 'react';
import {Container, Grid, Typography, Paper, Card, ListItem, List, Divider} from '@mui/material';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Bar, Line} from "react-chartjs-2";

const DashboardAdmin = () => {
    let currentUser = localStorage.getItem('logged_user');

    const navigate = useNavigate();

    if (!currentUser) {
        navigate("/login");
    }

    const [avgPagesByTagData, setAvgPagesByTagData] = useState([]);
    const [avgPagesByTagByMonthData, setAvgPagesByTagByMonthData] = useState([]);

    async function fetchAvgByTag() {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/competition/analytic/pagesByTag`);
            console.log("Avg pages by tag: ", response.data);
            // Convert the object to an array of objects
            let data = Object.entries(response.data).map(([tag, pages]) => ({tag, pages}));
            // Sort the data by pages
            data.sort((a, b) => b.pages - a.pages);
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
            const currentMonth = date.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month)
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
        fetchAvgByTagMonth();
    }, [currentUser['_id']]);

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 18,
        width: '100%'
    }

    const avgPagesByTagRank = avgPagesByTagData
        .sort((a, b) => a.pages - b.pages)
        .map((data, index) => (
            <React.Fragment>
                <ListItem key={index} sx={{backGroundColor: '#ffffff', '&:hover': {backgroundColor: "#f1f7fa"}}}>
                    <strong>#{index + 1}</strong> {'. ' + data.tag}: {data.pages} pages
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
        <div style={{height: '300px'}}>
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
        <div style={{height: '330px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Bar
            data={{
                labels: avgPagesByTagData.map((data) => data.tag),
                datasets: [
                    {
                        label: 'Average pages read',
                        data: avgPagesByTagData.map((data) => data.pages),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
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
                <Grid container spacing={1} textAlign="center">
                    <Grid container item xs={12} spacing={2} direction="row" justifyContent="space-around" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h5">Competitions</Typography>
                        </Grid>
                        <Grid container item xs={8} direction="column" spacing={2}>
                            <Grid item xs={12}>
                                <Card sx={{padding: '10px', borderRadius: 5}}>
                                    <Typography variant="h5">Average points of the top 10s by tag and month</Typography>
                                    {avgPagesByTagByMonthChart}
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card sx={{padding: '10px', borderRadius: 5}}>
                                    <Typography variant="h5">Average points of the top 10s by tag</Typography>
                                    {avgPagesByTagChart}
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Card sx={{padding: '10px', borderRadius: 5}}>
                                <Typography variant="h5">Least participated and average top 10s points, last six months</Typography>
                                <List sx={ListStyle}>{avgPagesByTagRank}</List>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default DashboardAdmin;