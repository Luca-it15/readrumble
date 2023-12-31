import React from 'react';
import Profile from '../components/Profile';

const user = {
  firstName: 'Mario',
  lastName: 'Rossi',
  email: 'mario.rossi@example.com',
  image: 'https://example.com/profile.jpg'
};

const App = () => {
  return (
    <div>
      <Profile {...user} />
    </div>
  );
}

export default App;
