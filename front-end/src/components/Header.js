// src/components/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleUserInfoClick = () => {
        navigate("/user-info");
    };

    const handleHamburgerClick = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle menu open/close
    };

    const handleLogoClick = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <header style={styles.header}>
            <div style={styles.logoContainer}>
                <div style={styles.hamburgerIcon} onClick={handleHamburgerClick}>
                    {/* Hamburger Menu Icon */}
                    <svg 
                        width="30" 
                        height="30" 
                        viewBox="0 0 30 30" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={styles.icon}
                    >
                        <rect width="30" height="30" rx="5" fill="#f4f4f4"/>
                        <path d="M5 7H25M5 15H25M5 23H25" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div style={styles.logo} onClick={handleLogoClick}>
                    NoteFree
                </div>
            </div>
            <input type="text" placeholder="Search..." style={styles.searchInput} />
            <div style={styles.userInfoIcon} onClick={handleUserInfoClick}>
                {/* User Info Icon */}
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

            {/* Menu - Display to the left of the hamburger icon */}
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
        position: 'relative', // To position the menu absolutely
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginLeft: '10px', // Spacing between logo and hamburger
        cursor: 'pointer', // Change cursor to pointer for logo
    },
    hamburgerIcon: {
        cursor: 'pointer',
    },
    icon: {
        transition: '0.3s',
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
    menu: {
        position: 'absolute',
        top: '60px', // Adjust based on header height
        left: '20px', // Align the menu to the left of the hamburger icon
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '10px',
        borderRadius: '4px',
        zIndex: 1000, // Ensure the menu appears above other elements
    },
};

export default Header;
