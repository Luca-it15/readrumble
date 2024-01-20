import React, {useEffect, useState} from 'react';
import {AppBar, Toolbar, Typography, Card, CardContent, Paper, Grid} from '@mui/material';
import {Bar, Line} from 'react-chartjs-2';
import {DataGrid} from '@mui/x-data-grid';
import {CategoryScale} from 'chart.js';
import axios from 'axios';
import Chart from 'chart.js/auto';
import {Navigate} from "react-router-dom";

const Dashboard = () => {
    let currentUser = JSON.parse(localStorage.getItem('logged_user'));

    const [readingProgressData, setReadingProgressData] = useState([]);
    const [readingStatsData, setReadingStatsData] = useState([]);

    async function fetchPagesTrend() {
        try {
            const response = await axios.get(`http://localhost:8080/api/analytics/pagesTrend/${currentUser['_id']}`);
            console.log("Pages trend: ", response.data);
            const data = response.data.map(doc => ({month: doc.month, year: doc.year, pages: doc.pages}));
            setReadingProgressData(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    async function fetchReadingStats() {
        try {
            const response = await axios.get(`http://localhost:8080/api/book/pagesReadByTag/${currentUser['_id']}`);
            console.log("Pages by tag: ", response.data);
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

    // This graph shows the read pages in the last 8 months
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

    const readingStatsChart = [
        <Bar
            data={{
                labels: readingStatsData.map((data) => data.tag),
                datasets: [
                    {
                        label: 'Pages read',
                        data: readingStatsData.map((data) => data.pagesRead),
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                        hoverBorderColor: 'rgba(75,192,192,1)',
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
            <Paper sx={{textAlign: 'center', borderRadius: 5, backgroundColor: '#ffffff', width:'100%', padding: '20px'}}>
                <Typography variant="h5">Reading progress</Typography>
                {readingProgressChart}
            </Paper>
            </Grid>
            <Grid item xs={6}>
            <Paper sx={{display: 'flex', flexDirection: 'column', textAlign: 'center', borderRadius: 5,
                backgroundColor: '#ffffff', width:'100%', padding: '20px'}}>
                <Typography variant="h5">Pages read by tag in the last six months</Typography>
                {readingStatsChart}
            </Paper>
            </Grid>
        </Grid>
        </Paper>
    );
};

export default Dashboard;
