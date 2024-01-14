import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from '@mui/material-next/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function FollowingList() {
    const [followings, setFollowings] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);

    const fetchFollowings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/following');
            setFollowings(response.data);
            console.log("Received: " + response.data)
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        fetchFollowings();
    }, []);

    const loadAllFollowings = () => {
        setDisplayCount(followings.length);
    };

    return (
        <Container>
            {followings.slice(0, displayCount).map((username, index) => (
                <Typography key={index}>{username}</Typography>
            ))}
            {followings.length > displayCount && (
                <Button variant="contained" onClick={loadAllFollowings}>Show all</Button>
            )}
        </Container>
    );
}

export default FollowingList;
