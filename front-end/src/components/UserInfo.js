// src/components/UserInfo.js
import { Link, useNavigate } from "react-router-dom";
import { Tree, Button } from 'antd';
import React, { useState, useEffect } from 'react';

const UserInfo = () => {
    // Check if token and userId are in localStorage
    const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId');
    const [userInfo, setUserInfo] = useState(null);
    const accessToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = () => {
        fetch(`http://localhost:5173/api/users/${userId}/info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setUserInfo(data);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                );
            }
            return <Tree.TreeNode {...item} />;
        });

    const treeData = userInfo && userInfo.organization
        ? userInfo.organization.map((org) => ({
              title: org.name,
              key: org._id,
              children: org.teams ? org.teams.map((team) => ({
                  title: team.name,
                  key: team._id
              })) : []
          }))
        : [];

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
        <div>
            <h1>User Info</h1>
            <Button onClick={handleLogout} style={{ marginBottom: '20px' }}>Đăng xuất</Button>
            {userInfo ? (
                <>
                    <h2>Username: {userInfo.username}</h2>
                    <Tree>{renderTreeNodes(treeData)}</Tree>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserInfo;