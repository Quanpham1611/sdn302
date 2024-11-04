// src/components/UserInfo.js
import React from "react";
import { Link } from "react-router-dom";

const UserInfo = () => {
    // Check if token and userId are in localStorage
    const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId');

    // If not logged in, render a message prompting login
    if (!isLoggedIn) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}>
                <h2>Bạn cần đăng nhập để xem thông tin người dùng</h2>
                <Link to="/login">Đăng nhập</Link>
            </div>
        );
    }

    // If logged in, render the main content
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h2>Thông tin người dùng, xin chào!</h2>
        </div>
    );
};

export default UserInfo;
