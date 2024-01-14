import {Avatar, Grid} from '@mui/material';
import React from 'react';
import Typography from "@mui/material/Typography";

const Profile = (props) => {
    return (
        <Grid container direction="row" alignItems="center" justifyContent="center">
            <Grid item xs={6} md={4}>
                <Avatar alt="users" src="../img/avatar.png" style={{ width: '100px', height: '100px'}}/>
            </Grid>
            <Grid item xs={6} md={4}>
                <Typography variant="h4" fontWeight="bold">{props._id}</Typography>
                <Typography>Name: <strong>{props.name}</strong></Typography>
                <Typography>Surname: <strong>{props.surname}</strong></Typography>
            </Grid>
        </Grid>
    );
}

export default Profile;