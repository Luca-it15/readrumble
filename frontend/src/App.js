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
import PostForm from './pages/PostForm';
import Dashboard from "./pages/UserDashboard";
import CompetitionPage from "./pages/Competition";
import CompetitionSpec from "./components/CompetitionSpecification";
import AdminLayout from './layout/AdminLayout';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import BookAdmin from './pages/admin/BookAdmin';
import CompetitionAdmin from './pages/admin/CompetitionAdmin';
import AddCompetition from './pages/admin/AddCompetition';
import CompetitionSpecAdmin from './pages/admin/CompetitionSpecAdmin';
import UserAdmin from './pages/admin/UserAdmin';
import PostAdmin from './pages/admin/PostAdmin';
import OtherUserProfile from './pages/OtherUserProfile';
import BookDetails from "./pages/BookDetails";
import BanUnbanProfile from './pages/admin/BanUnbanProfile';
import PostDetails from './pages/PostDetails';
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const [isAdmin, setIsAdmin] = useState(
        JSON.parse(localStorage.getItem('isAdmin')) || false
    );

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('logged_user');
        localStorage.removeItem('isAdmin');
    };

    return (
        <BrowserRouter>
            <Container fluid="false">
                <Row>
                    <Col>
                        {isLoggedIn ? (isAdmin ?
                            (<AdminLayout>
                                <Routes>
                                    <Route
                                        path="/admin/user/banunban/:name"
                                        element={<BanUnbanProfile />}
                                    />
                                    <Route
                                        path="/logout"
                                        element={<Logout onLogout={handleLogout}/>}
                                    />
                                    <Route
                                        exact
                                        path="/dashboard"
                                        element={
                                            <DashboardAdmin/>}
                                    />
                                    <Route
                                        path="/admin_book"
                                        element={
                                            <BookAdmin/>}
                                    />
                                    <Route
                                        path="/admin_competition"
                                        element={
                                            <CompetitionAdmin/>}
                                    />
                                    <Route
                                        path="/admin_competition/:name"
                                        element={
                                            <CompetitionSpecAdmin/>}
                                    />
                                    <Route
                                        path="/admin_competition/add_comp"
                                        element={
                                            <AddCompetition/>}
                                    />
                                    <Route
                                        path="/admin_user"
                                        element={
                                            <UserAdmin/>}
                                    />
                                    <Route
                                        path="/admin_post"
                                        element={
                                            <PostAdmin/>}
                                    />
                                </Routes>
                            </AdminLayout>) : (
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
                                                isLoggedIn ? (<ProfilePage/>) : <Navigate to="/"/>
                                            }
                                        />
                                        <Route
                                            /* !!! UNTESTED !!! */
                                            path="/user/:username"
                                            element={
                                                isLoggedIn ? (<OtherUserProfile/>) : <Navigate to="/"/>
                                            }
                                        />
                                        <Route
                                            path="/post"
                                            element={
                                                isLoggedIn ? (<PostForm/>) : <Navigate to="/"/>
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
                                        <Route
                                            path="/competitions"
                                            element={
                                                isLoggedIn ? <CompetitionPage/> : <Navigate to="/"/>
                                            }
                                        />
                                        <Route
                                            path="/competition/:name"
                                            element={
                                                isLoggedIn ? <CompetitionSpec/> : <Navigate to="/"/>
                                            }
                                        />
                                        <Route
                                            path="/bookdetails/:id"
                                            element={<BookDetails/>}
                                        />
                                         <Route
                                            path="/posts/:id"
                                            element={<PostDetails/>}
                                        />
                                        <Route path="*" element={<Error/>}/>
                                    </Routes>
                                </AuthenticationLayout>
                            )) : (
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
