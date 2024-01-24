import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Grid, LinearProgress, Link, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue} from "@mui/material/colors";

function CurrentlyReading({user}) {
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [displayCount, setDisplayCount] = useState(3);

    const navigate = useNavigate();

    const fetchBooks = async () => {
        try {
            console.log("Fetching currently reading books of " + user);

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
        setDisplayCount(currentlyReading.length);
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
        margin: '20px 10px 0px 10px',
        borderRadius: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5" textAlign='center'>Now reading</Typography>
                <Grid container direction="row" justifyContent="space-around" sx={{gap: '15px'}}>
                    {currentlyReading.length === 0 ? (
                    <Grid item xs={12} sx={{textAlign: 'center', borderRadius: '20px', backgroundColor: '#ffffff'}}>
                        <Typography>No books to show
                            {user === JSON.parse(localStorage.getItem('logged_user'))['_id'] ? (
                                <Typography> - <Link sx={{color: blue[700]}} onClick={goExplore}>Add some!</Link></Typography>
                            ) : ("")}
                        </Typography>
                    </Grid>
                    ) : (
                    Array.isArray(currentlyReading) && currentlyReading.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <Grid container direction="row" justifyContent="center" alignItems="center"
                                  sx={{borderRadius: '15px', backgroundColor: '#ffffff', padding: '10px',
                                      width: '32%', textAlign: 'center'}}>
                                <Grid item xs={12}>
                                    <Link onClick={() => {seeDetails(book.id)}} sx={{color: "#000000"}}>
                                        <Typography>{book.title}</Typography>
                                    </Link>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography sx={{color: '#777777'}}>
                                        {book.bookmark} / {book.num_pages}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <LinearProgress sx={{borderRadius: 10, height: '7px'}} variant="determinate" value={book.bookmark * 100 / book.num_pages}/>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    )))}
                </Grid>
            {currentlyReading.length > displayCount ? (
                <Button sx={{backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}}}
                        variant="filledTonal" onClick={loadAllBooks}>
                    <Typography>Show all</Typography>
                </Button>
            ) : (
                <Button sx={{backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}}}
                        variant="filledTonal" onClick={loadLessBooks}>
                    <Typography>Show less</Typography>
                </Button>
            )}
        </Paper>
    );
}

export default CurrentlyReading;