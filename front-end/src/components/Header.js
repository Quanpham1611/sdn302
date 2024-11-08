// src/components/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleUserInfoClick = () => {
        navigate("/user-info");
    };

    const handleLogoClick = () => {
        navigate("/"); // Navigate to the home page
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchSearchResults(searchQuery);
        }
    };

    const fetchSearchResults = (query) => {
        const accessToken = localStorage.getItem('token');
        fetch(`http://localhost:5173/api/users/search?q=${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
                navigate('/search-results', { state: { searchResults: data } });
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    };

    return (
        <header style={styles.header}>
            <div style={styles.logoContainer}>
                <div style={styles.logo} onClick={handleLogoClick}>
                    NoteFree
                </div>
            </div>
            <input
                type="text"
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
            />
            <div style={styles.userInfoIcon} onClick={handleUserInfoClick}>
                <svg 
                    width="30" 
                    height="30" 
                    viewBox="0 0 30 30" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={styles.icon}
                >
                    <circle cx="15" cy="15" r="12" stroke="#333" strokeWidth="2" />
                    <path d="M15 17C17.2091 17 19 15.2091 19 13C19 10.7909 17.2091 9 15 9C12.7909 9 11 10.7909 11 13C11 15.2091 12.7909 17 15 17Z" fill="#333"/>
                </svg>
            </div>

            {isMenuOpen && (
                <div style={styles.menu}>
                    <p>Menu Item 1</p>
                    <p>Menu Item 2</p>
                    <p>Menu Item 3</p>
                </div>
            )}
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#f4f4f4',
        borderBottom: '1px solid #ccc',
        position: 'relative',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginLeft: '10px',
        cursor: 'pointer',
    },
    searchInput: {
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '300px',
    },
    userInfoIcon: {
        cursor: 'pointer',
    },
};

export default Header;