// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import LoginForm from "./components/login";
import RegisterForm from "./components/register"; 
import Home from "./components/home";
import Header from "./components/Header"; // Import the Header component
import UserInfo from "./components/UserInfo"; // Import User Info component
import { useNavigate } from "react-router-dom"; 

function App() {
    return (
        <Router>
            <Main />
        </Router>
    );
}

function Main() {
    const navigate = useNavigate();

    const handleSwitchToRegister = () => {
        navigate("/register");
    };

    const handleSwitchToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginForm onSwitchToRegister={handleSwitchToRegister} />} />
                <Route path="/register" element={<RegisterForm onSwitchToLogin={handleSwitchToLogin} />} />
                {/* Wrap the header and child routes in a layout route */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/user-info" element={<UserInfo />} />
                </Route>
            </Routes>
        </>
    );
}

// Layout component that includes the Header
function Layout() {
    return (
        <>
            <Header />
            <Outlet /> {/* This will render the matched child route */}
        </>
    );
}

export default App;
