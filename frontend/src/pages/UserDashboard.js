import React, {useEffect, useState} from 'react';
import {Typography, Card, Paper, Grid} from '@mui/material';
import {Line} from 'react-chartjs-2';
import {DataGrid} from '@mui/x-data-grid';
import axios from 'axios';
import {Navigate} from "react-router-dom";

var currentUser = JSON.parse(localStorage.getItem('logged_user'));
if (!currentUser) {
    console.log('La chiave "logged_user" non è presente in localStorage.');
    // Redirect to login
    <Navigate to="/login"/>;
}

const Dashboard = () => {
    const [readingProgressData, setReadingProgressData] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [readingStatsData, setReadingStatsData] = useState([]);

    async function fetchPagesTrend() {
        try {
            const response = await axios.get(`http://localhost:8080/api/analytics/pagesTrend/${currentUser['_id']}`);
            console.log("Received: ", response.data);
            const data = response.data.map(doc => ({month: doc.month, year: doc.year, pages: doc.pages}));
            setReadingProgressData(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchPagesTrend();

        setCompetitionData([
            {id: 1, name: 'Mario', rank: 1, pagesRead: 100},
            {id: 2, name: 'Luigi', rank: 2, pagesRead: 80},
            {id: 3, name: 'Peach', rank: 3, pagesRead: 70},
        ]);
        setReadingStatsData([
            {id: 1, genre: 'Fantasy', pagesRead: 300},
            {id: 2, genre: 'Horror', pagesRead: 200},
            {id: 3, genre: 'Romance', pagesRead: 150},
        ]);
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

    const competitionColumns = [
        {field: 'name', headerName: 'Name', width: 130},
        {field: 'rank', headerName: 'Rank', width: 130},
        {field: 'pagesRead', headerName: 'Pages Read', width: 160},
    ];

    const readingStatsColumns = [
        {field: 'genre', headerName: 'Genre', width: 130},
        {field: 'pagesRead', headerName: 'Pages Read', width: 160},
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

            <Paper sx={{textAlign: 'center', borderRadius: 5, backgroundColor: '#ffffff', width:'70%', padding: '20px'}}>
                <Grid item xs={12}><Typography variant="h5">Reading progress</Typography></Grid>
                {readingProgressChart}
            </Paper>
            <Paper sx={{display: 'flex', flexDirection: 'row', textAlign: 'center', borderRadius: 5,
                backgroundColor: '#ffffff', width:'50%', padding: '20px'}}>

                {/* TODO: analytic competizioni */}
                <Card>
                    <Typography variant="h5">Reading stats</Typography>
                    <DataGrid rows={readingStatsData} columns={readingStatsColumns} pageSize={5}/>
                </Card>
            </Paper>

        </Paper>
    );
};

export default Dashboard;
