import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Explore from './pages/Explore';
import UserSettings from './pages/UserSettings';
import Error from './pages/Error';
import './App.css';
import AuthenticationLayout from './layout/AuthenticationLayout';
import LoginForm from './pages/Login';
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
import UserAdmin from './pages/admin/UserAdmin';
import PostAdmin from './pages/admin/PostAdmin';
import OtherUserProfile from './pages/OtherUserProfile';
import BookDetails from "./pages/BookDetails";
import BanUnbanProfile from './pages/admin/BanUnbanProfile';
import PopularCompetitionBlock from './components/PopularCompetitionBlock';
import PostDetails from './pages/PostDetails';
import AddBook from './pages/admin/AddBook'; 
import UpdateBook from './pages/admin/UpdateBook';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('isLoggedIn')) || false);
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin')) || false;

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <BrowserRouter>
            <Container fluid="false">
                {isLoggedIn ? (isAdmin ?
                    (
                        <AdminLayout>
                            <Routes>
                                <Route
                                    path="/admin/user/banunban/:name"
                                    element={<BanUnbanProfile/>}
                                />
                                <Route
                                    exact
                                    path="/home"
                                    element={<DashboardAdmin/>}
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
                                    path="/competition/:name"
                                    element={
                                        <CompetitionSpec/>}
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
                                <Route
                                    path="/posts/:id"
                                    element={<PostDetails/>}
                                />
                                <Route
                                    path="/bookdetails/:id"
                                    element={<BookDetails/>}
                                />
                                  <Route
                                    path="/addBook"
                                    element={<AddBook/>}
                                />
                                   <Route
                                    path="/updateBook/:id"
                                    element={<UpdateBook/>}
                                />
                            </Routes>
                        </AdminLayout>
                    ) : (
                        <AuthenticationLayout>
                            <Routes>
                                <Route
                                    exact
                                    path="/popular"
                                    element={<PopularCompetitionBlock/>}
                                />
                                <Route
                                    path="/home"
                                    element={<Home/>}
                                />
                                <Route
                                    path="/explore"
                                    element={<Explore/>}
                                />
                                <Route
                                    path="/settings"
                                    element={<UserSettings/>}
                                />
                                <Route
                                    path="/profile"
                                    element={<ProfilePage/>}
                                />
                                <Route
                                    path="/user/:username"
                                    element={<OtherUserProfile/>}
                                />
                                <Route
                                    path="/post"
                                    element={<PostForm/>}
                                />
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard/>}
                                />
                                <Route
                                    path="/competitions"
                                    element={<CompetitionPage/>}
                                />
                                <Route
                                    path="/competition/:name"
                                    element={<CompetitionSpec/>}
                                />
                                <Route
                                    path="/bookdetails/:id"
                                    element={<BookDetails/>}
                                />
                                <Route
                                    path="/posts/:id"
                                    element={<PostDetails/>}
                                />
                                <Route
                                    path="/"
                                    element={<Navigate to="/home" replace/>}
                                />
                                <Route path="*" element={<Error/>}/>
                            </Routes>
                        </AuthenticationLayout>
                    )
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
            </Container>
        </BrowserRouter>
    );
};

export default App;
