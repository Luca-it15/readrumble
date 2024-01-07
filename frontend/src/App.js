import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes, Navigate, redirect} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Explore from './pages/Explore';
import UserSettings from './pages/UserSettings';
import Error from './pages/Error';
import './App.css';
import AuthenticationLayout from './layout/AuthenticationLayout';
import LoginForm from './pages/Login';
import Logout from './components/Logout';
import GuestLayout from './layout/GuestLayout';
import RegistrationForm from './pages/Registration';
import ReviewForm from './pages/ReviewForm';
import Dashboard from "./pages/UserDashboard";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('logged_user');
    };

    return (
        <BrowserRouter>
            <Container fluid="false">
                <Row>
                    <Col>
                        {isLoggedIn ? (
                            <AuthenticationLayout>
                                <Routes>
                                    <Route
                                        exact
                                        path="/dashboard"
                                        element={
                                            isLoggedIn ? <Home/> : <Navigate to="/"/>
                                        }
                                    />
                                    <Route
                                        path="/explore"
                                        element={
                                            isLoggedIn ? <Explore/> : <Navigate to="/"/>
                                        }
                                    />
                                    <Route
                                        path="/settings"
                                        element={
                                            isLoggedIn ? <UserSettings/> : <Navigate to="/"/>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            isLoggedIn ? (<ProfilePage/>) : redirect("/")
                                        }
                                    />

                                    <Route
                                        path="/review"
                                        element={
                                            isLoggedIn ? (<ReviewForm/>) : redirect("/")
                                        }
                                    />
                                    <Route
                                        path="/logout"
                                        element={<Logout onLogout={handleLogout}/>}
                                    />
                                    <Route
                                        path="/userDashboard"
                                        element={
                                            isLoggedIn ? <Dashboard/> : <Navigate to="/"/>
                                        }
                                    />
                                    <Route path="*" element={<Error/>}/>
                                </Routes>
                            </AuthenticationLayout>
                        ) : (
                            <GuestLayout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<LoginForm onLogin={handleLogin}/>}
                                    />
                                    <Route
                                        path="/registration"
                                        element={<RegistrationForm/>}
                                    />
                                    <Route path="*" element={<Navigate to="/"/>}/>
                                </Routes>
                            </GuestLayout>
                        )}
                     </Col>
                  </Row>
            </Container>
        </BrowserRouter>
    );
};

export default App;
