import React from 'react';

const Profile = (props) => {
  return (
    <div>
      <h1>Profilo Utente</h1>
      <img src={props.image} alt="Immagine del profilo" />
      <p>Nome: <strong>{props.firstName}</strong></p>
      <p>Cognome: <strong>{props.lastName}</strong></p>
      <p>Email: <strong>{props.email}</strong></p>
    </div>
  );
}

export default Profile;