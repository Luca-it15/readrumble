import React from 'react';

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
   
      // Imposta la variabile di stato per abilitare il reindirizzamento
  // Se la conferma è avvenuta, reindirizza l'utente alla pagina di login
    onLogout(); 
    window.location.href = 'http://localhost:3000/';

  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
