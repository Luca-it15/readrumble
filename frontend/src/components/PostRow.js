import * as React from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from 'react-router-dom';
import UserIcon from '@mui/icons-material/PermIdentityTwoTone';
import DateIcon from '@mui/icons-material/CalendarTodayTwoTone';
import Typography from '@mui/material/Typography';
import RatingStars from './RatingStars';
import DateFormatter from './DataFormatter';
import {Grid, Link, Paper} from '@mui/material';
import Button from '@mui/material-next/Button';
import {blue} from "@mui/material/colors";

export default function PostRow({id, book_id, title, username, rating, text, readOnly, date, user, all}) {
    const navigate = useNavigate();

    if (text === undefined) {
        text = "";
    } else {
        text = text.substring(0, 150) + "...";
    }

    function seeDetails(id) {
        if (id === 0) {
            let arrayPostJson = localStorage.getItem('last_posts');
            let arrayPost = JSON.parse(arrayPostJson);

            let dateToFind = date
            let postFilter = arrayPost.filter(post => post.date_added === dateToFind);

            let postFilterJson = JSON.stringify(postFilter);

            localStorage.removeItem('post_details');
            localStorage.setItem('post_details', postFilterJson);
            navigate(`/posts/${id}/`);
        } else
            navigate(`/posts/${id}/`);
    }

    function seeBookDetails(book_id) {
        navigate(`/bookdetails/${book_id}/`);
    }

    function seeProfile(username) {
        navigate(`/user/${username}/`);
    }

    return (
        <Paper elevation={0} sx={{borderRadius: 5, padding: '18px 24px 10px 24px', width: '100%'}}>
            <Grid container direction="row" alignItems="center" justifyContent="center" xs={12} sx={{width: '100%'}}>
                {!user.user && (
                    <Grid item xs={6}>
                        <Link sx={{color: "#000000", textAlign: 'left'}}>
                            <Typography onClick={() => {seeProfile(username)}} sx={{'&:hover': {cursor: 'pointer'}}}>
                                <UserIcon sx={{color: blue[400], margin: '0px 3px 3px 0px'}}/>
                                {username}
                            </Typography>
                        </Link>
                    </Grid>
                )}

                <Grid item xs={!user.user ? 6 : 12}>
                    <Typography textAlign="right" sx={{color: '#999999'}}>
                        <DateFormatter timestamp={date}/>
                        <DateIcon sx={{color: blue[400], margin: '0px 0px 5px 3px', height: '20px'}}/>
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Link onClick={() => {seeBookDetails(book_id)}} sx={{color: "#000000", textAlign: 'center'}}>
                        <Typography variant="h6" sx={{margin: '5px', '&:hover': {cursor: 'pointer'}}}>
                            {title}
                        </Typography>
                    </Link>
                </Grid>

                <Grid item xs={12}>
                    <RatingStars onChange={rating} readOnly={readOnly} isStatic={true} star={rating}/>
                </Grid>

                {text !== undefined && (
                    <Grid item xs={12}>
                        <Typography sx={{textAlign: 'justify', margin: '5px'}}>{text}</Typography>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Button onClick={() => {seeDetails(id)}} sx={{backgroundColor: blue[100], marginY: "10px",
                        height: "30px", '&:hover': {backgroundColor: blue[100]}}} variant="filledTonal">
                        <Typography sx={{margin: '5px'}}>See more</Typography>
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
