import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Home from './pages/Home';
import Profile from './pages/ProfiloPage';
import Explore from './pages/Explore';
import Error from './pages/Error';
import './App.css';
import AuthenticationLayout from './layout/AuthenticationLayout';
import Login from './pages/Login';
import GuestLayout from './layout/GuestLayout';
import RegistrationForm from './pages/Registration';


  const App = () => {
   

    const isLoggedIn = true; 

    

    return (
      <BrowserRouter>
        <Container fluid="false">
          <Row>
            <Col>
            {isLoggedIn ? (<AuthenticationLayout>
            <Routes>
            <Route exact path="/dashboard" 
              element={isLoggedIn ? (<Home />) : <Navigate to="/login" />}
             />
            <Route path="/explore" 
              element={isLoggedIn ? (<Explore />) : <Navigate to="/login" />}
             />
            <Route path="/profile" 
              element={isLoggedIn ? (<Profile />) : <Navigate to="/login" />}
             /> 
             <Route path="*" element={<Error />} />
             </Routes>
             </AuthenticationLayout>
              ) : 
              (  <GuestLayout> 
               <Routes>   
               <Route path="/" element={<Login />} />
               <Route path="/registration" element={<RegistrationForm />} />
               </Routes> 
               </GuestLayout> 
              )}
           </Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
}

export default App;