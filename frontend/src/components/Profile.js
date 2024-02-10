import {Grid} from '@mui/material';
import React from 'react';
import Typography from "@mui/material/Typography";
import userImage from '../img/avatar.png';

const Profile = (props) => {
    return (
        <Grid container direction="row" alignItems="center" justifyContent="center">
            <Grid item xs={6} sx={{marginRight: '-25%'}}>
                <img src={userImage} alt="user" style={{width: '45%'}}/>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h4" fontWeight="bold">{props._id}</Typography>
                <Typography>Name: <strong>{props.name}</strong></Typography>
                <Typography>Surname: <strong>{props.surname}</strong></Typography>
            </Grid>
        </Grid>
    );
}

export default Profile;