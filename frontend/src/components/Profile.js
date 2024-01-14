import { Avatar } from '@mui/material';
import React from 'react';

const Profile = (props) => {
  return (
    <div>
      <h1>Profilo Utente</h1>
      <Avatar alt="users" src="../img/avatar.png" />
      <p>Name: <strong>{props.name}</strong></p>
      <p>Surname: <strong>{props.surname}</strong></p>
      <p>Username: <strong>{props._id}</strong></p>
    </div>
  );
}

export default Profile;