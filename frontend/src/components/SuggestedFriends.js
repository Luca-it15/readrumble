import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import { Divider, Link, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

function SuggestedFriends({user}) {
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

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/suggestedFriends/${user}`);

            const suggestions = response.data
            // Returns book.id and book.title
            setSuggestFriends(suggestions.map(user => ({
                username: user.name
            })));

            console.log("Suggested Friends: " + JSON.stringify(response.data));

        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    const loadAllUsers = () => {
        setDisplayCount(suggestFriends.length);
    };

    function seeDetails(id) {
        navigate(`/user/{id}`);
    }

    return (
        <>
            <List sx={ListStyle}>
                {suggestFriends.length === 0 ? (
                    <ListItem>
                        <Typography>No suggested friend to show</Typography>
                    </ListItem>
                ) : (
                    Array.isArray(suggestFriends) && suggestFriends.slice(0, displayCount).map((book, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{'&:hover': {backgroundColor: "#f1f7fa", borderRadius: '30px'}}}>
                                <Link onClick={() => {
                                    seeDetails(user.name)
                                }} sx={{color: "#000000"}}>
                                    <Typography>{user.name}</Typography>
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
                        variant="filledTonal" onClick={loadAllUsers}>
                    <Typography>Show all</Typography>
                </Button>
            )}
        </>
    );
}

export default SuggestedFriends;