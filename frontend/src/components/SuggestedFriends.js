import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import {Divider, Link, List, ListItem, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {blue} from "@mui/material/colors";

function suggestFriends({user}) {
    const navigate = useNavigate();
    const [suggestFriends, setSuggestFriends] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);


    const ListStyle = {
        py: 0,
        width: '100%',
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const fetchBooks = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/api/suggestedFriends/${user}`);

            const suggestions = response.data
            // Returns book.id and book.title
            setSuggestFriends(suggestions.map(book => ({
                id: book.id.replace(/"/g, ''),
                title: book.title.replace(/"/g, '')
            })));

            console.log("Suggested Friends: " + JSON.stringify(response.data));

        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [user]);

    const loadAllBooks = () => {
        setDisplayCount(suggestFriends.length);
    };

    function seeDetails(id) {
        navigate(`/user/{id}`);
    }

    const PaperStyle = {
        backgroundColor: '#f1f7fa',
        padding: '10px',
        margin: '20px 10px 0px 10px',
        borderRadius: 5,
        width: '100%'
    }

    return (
        <Paper sx={PaperStyle}>
            <Typography variant="h5" sx={{textAlign: 'center'}}>Suggestions by users you follow</Typography>
            <List sx={ListStyle}>
                {suggestFriends.length === 0 ? (
                    <ListItem>
                        <Typography>No suggest friend to show</Typography>
                    </ListItem>
                ) : (
                    Array.isArray(suggestFriends) && suggestFriends.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa"}}}>
                                <Link onClick={() => {
                                    seeDetails(book.id)
                                }} sx={{color: "#000000"}}>
                                    <Typography>{book.title}</Typography>
                                </Link>
                            </ListItem>
                            <Divider variant="middle" component="li"/>
                        </React.Fragment>
                    ))
                )}
            </List>
            {suggestFriends.length > displayCount && (
                <Button sx={{
                    backgroundColor: blue[100], marginTop: "10px", height: "30px",
                    '&:hover': {backgroundColor: blue[100]}
                }}
                        variant="filledTonal" onClick={loadAllBooks}>
                    <Typography>Show all</Typography>
                </Button>
            )}
        </Paper>
    );
}

export default suggestFriends;