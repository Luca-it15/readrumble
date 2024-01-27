import React, {useEffect, useState} from 'react';
import {Typography, Paper, Grid} from '@mui/material';
import {Bar, Line} from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Dashboard = () => {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [readingProgressData, setReadingProgressData] = useState([]);
    const [readingStatsData, setReadingStatsData] = useState([]);

    async function fetchPagesTrend() {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/analytics/pagesTrend/${currentUser['_id']}`);
            const data = response.data.map(doc => (
                {
                    month: doc.month,
                    year: doc.year,
                    pages: doc.pages
                }
            ));

            setReadingProgressData(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    async function fetchReadingStats() {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/pagesReadByTag/${currentUser['_id']}`);
            const data = response.data.map(doc => ({tag: doc._id, pagesRead: doc.pages_read}));

            setReadingStatsData(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchPagesTrend();
        fetchReadingStats();
    }, [currentUser['_id']]);

    const readingProgressChart = (
        <Line
            data={{
                labels: readingProgressData.map((data) => data.month + '/' + data.year),
                datasets: [
                    {
                        label: 'Pages read',
                        data: readingProgressData.map((data) => data.pages),
                        fill: true,
                        tension: 0.2
                    },
                ],
            }}
        />
    );

    const totalPages = readingStatsData.reduce((total, data) => total + data.pagesRead, 0);
    const favoriteTag = readingStatsData.reduce((max, data) => max.pagesRead > data.pagesRead ? max : data, {
        pagesRead: 0,
        tag: ''
    }).tag;
    const leastFavoriteTag = readingStatsData.reduce((min, data) => min.pagesRead < data.pagesRead ? min : data, {
        pagesRead: Infinity,
        tag: ''
    }).tag;

    const readingStatsChart = [
        <Bar
            data={{
                labels: readingStatsData.map((data) => data.tag),
                datasets: [
                    {
                        label: 'Pages read',
                        data: readingStatsData.map((data) => data.pagesRead),
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderWidth: 0,
                        borderRadius: 15,
                        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
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
    ];

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '10px',
        borderRadius: 5,
        width: '98vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5">
                {currentUser['_id']}'s dashboard
            </Typography>
            <Grid container direction="row" justifyContent="space-around" alignItems="center" spacing={1}>
                <Grid item xs={6}>
                    <Paper sx={{
                        textAlign: 'center',
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                        width: '100%',
                        padding: '20px'
                    }}>
                        <Typography variant="h5">Reading progress of the last months</Typography>
                        {readingProgressChart}
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper sx={{
                        display: 'flex', flexDirection: 'column', textAlign: 'center', borderRadius: 5,
                        backgroundColor: '#ffffff', width: '100%', padding: '20px'
                    }}>
                        <Typography variant="h5">Pages read by tag in the last six months</Typography>
                        {readingStatsChart}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        display: 'flex', flexDirection: 'column', textAlign: 'center', borderRadius: 5,
                        backgroundColor: '#ffffff', width: '100%', padding: '20px'
                    }}>
                        <Typography variant="h5">Other reading stats</Typography>
                        <Typography>Total pages read in the last six months: <strong>{totalPages}</strong></Typography>
                        <Typography>Favorite tag: <strong>{favoriteTag}</strong></Typography>
                        <Typography>Least favorite tag: <strong>{leastFavoriteTag}</strong></Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Dashboard;
