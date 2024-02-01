import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Grid, LinearProgress, Link, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue, red} from "@mui/material/colors";

function CurrentlyReading({user}) {
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [displayCount, setDisplayCount] = useState(3);

    const navigate = useNavigate();

    const fetchBooks = async () => {
        if (user === JSON.parse(localStorage.getItem('logged_user'))['_id']) {
            const currentUser = JSON.parse(localStorage.getItem('logged_user'));

            if (currentUser['currentlyReading'] && currentUser['currentlyReading'].length > 0) {
                setCurrentlyReading(currentUser['currentlyReading']);
                return;
            }
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/book/currentlyReadingBooks/${user}`);

            const booksReceived = JSON.parse(JSON.stringify(response.data));

            // Returns book.id and book.title
            setCurrentlyReading(booksReceived.map(book => ({
                id: book.id,
                title: book.title.replace(/"/g, ''),
                bookmark: book.bookmark,
                num_pages: book.num_pages
            })));
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [user]);

    const loadAllBooks = () => {
        setDisplayCount(displayCount + 6);
    };

    const loadLessBooks = () => {
        setDisplayCount(3);
    }

    function seeDetails(id) {
        navigate(`/bookdetails/${id}`);
    }

    function goExplore() {
        navigate('/explore');
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        borderRadius: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }

    return (
        <Paper sx={PaperStyle} elevation={2}>
            <Typography variant="h5" textAlign='center' sx={{marginBottom: '8px'}}>Now reading</Typography>
            <Grid container direction="column" justifyContent="space-around" sx={{gap: '15px'}}>
                <Grid container item direction="row" justifyContent="space-evenly" sx={{gap: '15px'}}>
                    {currentlyReading.length === 0 ? (
                        <Grid item xs={12} sx={{textAlign: 'center', borderRadius: '20px', backgroundColor: '#ffffff'}}>
                            <Typography>No books to show
                                {user === JSON.parse(localStorage.getItem('logged_user'))['_id'] ? (
                                    <Typography> - <Link sx={{color: blue[700]}} onClick={goExplore}>Add
                                        some!</Link></Typography>
                                ) : ("")}
                            </Typography>
                        </Grid>
                    ) : (
                        currentlyReading.slice(0, displayCount).map((book) => (
                            <Paper elevation={0} sx={{width: '32%', boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.2)',
                                    borderRadius: 4, padding: '8px', margin: '0px',
                                    '&:hover': {boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.2)', cursor: 'pointer'}}}>

                                <Grid container direction="column" justifyContent="space-around" alignItems="center"
                                      sx={{textAlign: 'center', height: '100%'}} onClick={() => {seeDetails(book.id)}}>

                                    <Grid item xs="auto">
                                        <Typography>{book.title}</Typography>
                                    </Grid>

                                    <Grid container item direction="row" justifyContent="center" alignItems="center">
                                        <Grid item xs={3}>
                                            <Typography sx={{color: '#777777'}}>
                                                {book.bookmark} / {book.num_pages}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <LinearProgress sx={{borderRadius: 10, height: '7px'}} variant="determinate"
                                                            value={book.bookmark * 100 / book.num_pages}/>
                                        </Grid>
                                        <Grid item xs={1.5}>
                                            <Typography sx={{color: blue[700]}}>
                                                {Math.round(book.bookmark * 100 / book.num_pages)}%
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Paper>
                        )))}
                </Grid>

                <Grid container item xs={12} direction="row" justifyContent="center" alignItems="center"
                      sx={{gap: '10px'}}>
                    {displayCount > 6 && currentlyReading.length > 6 ? (
                        <Button variant="filledTonal" onClick={loadLessBooks} sx={{
                            backgroundColor: red[100], marginTop: "10px", height: "30px",
                            '&:hover': {backgroundColor: red[100]}
                        }}>
                            <Typography>Show less</Typography>
                        </Button>
                    ) : null}
                    {currentlyReading.length > displayCount ? (
                        <Button variant="filledTonal" onClick={loadAllBooks} sx={{
                            backgroundColor: blue[100], marginTop: "10px", height: "30px",
                            '&:hover': {backgroundColor: blue[100]}
                        }}>
                            <Typography>Show more</Typography>
                        </Button>
                    ) : null}
                </Grid>
            </Grid>
        </Paper>
    );
}

export default CurrentlyReading;