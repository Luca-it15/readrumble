import React from 'react';

const User = (props) => {
  return (
    <div>
      <h1>Profilo Utente</h1>
      <img src={props.image} alt="Immagine del profilo" />
      <p>Name: <strong>{props.Name}</strong></p>
      <p>Surname: <strong>{props.Surname}</strong></p>
      <p>Username: <strong>{props.Username}</strong></p>
    </div>
  );
}

export default User;