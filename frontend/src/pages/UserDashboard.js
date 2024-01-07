import React, {useEffect, useState} from 'react';
import {AppBar, Toolbar, Typography, Card, CardContent} from '@mui/material';
import {Line} from 'react-chartjs-2';
import {DataGrid} from '@mui/x-data-grid';
import {CategoryScale} from 'chart.js';
import axios from 'axios';
import Chart from 'chart.js/auto';

var storedData = localStorage.getItem('logged_user')
if (storedData) {
    var user = JSON.parse(storedData);
} else {
    console.log('La chiave "logged_user" non è presente in localStorage.');
    // Redirect to login
    window.location.href = 'http://localhost:3000/login';
}

const Dashboard = () => {
    const [readingProgressData, setReadingProgressData] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [readingStatsData, setReadingStatsData] = useState([]);

    useEffect(() => {
        // Fai la tua richiesta al server qui
        // Ho usato dati fittizi per l'esempio
        setReadingProgressData([
            {id: "10-04", pages: 10},
            {id: "17-04", pages: 25},
            {id: "24-04", pages: 40},
            {id: "01-05", pages: 30},
            {id: "08-05", pages: 50},
            {id: "15-05", pages: 70},
            {id: "22-05", pages: 40},
            {id: "29-05", pages: 60},
        ]);
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
    }, []);

    // This graph shows the read pages in the last 8 weeks
    const readingProgressChart = (
        <Line
            data={{
                labels: readingProgressData.map((data) => data.id),
                datasets: [
                    {
                        label: 'Pages read',
                        data: readingProgressData.map((data) => data.pages),
                        fill: true,
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

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        {user['Name']}'s dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '2rem'}}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Reading progress</Typography>
                        {readingProgressChart}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Competitions</Typography>
                        <div style={{height: 400, width: '100%'}}>
                            <DataGrid rows={competitionData} columns={competitionColumns} pageSize={5}/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Reading stats</Typography>
                        <div style={{height: 400, width: '100%'}}>
                            <DataGrid rows={readingStatsData} columns={readingStatsColumns} pageSize={5}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
