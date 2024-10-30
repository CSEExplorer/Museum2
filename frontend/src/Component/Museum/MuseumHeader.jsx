import React from 'react';
import { Link } from 'react-router-dom';

const MuseumHeader = () => {
    return (
        <header style={headerStyles}>
         
            <nav>
                <ul style={navStyles}>
                    <li style={navItemStyles}><Link to="museum-dashboard" style={linkStyles}>Dashboard</Link></li>
                    <li style={navItemStyles}><Link to="/museum/tickets" style={linkStyles}>Manage Tickets</Link></li>
                    <li style={navItemStyles}><Link to="/museum/offers" style={linkStyles}>Manage Offers</Link></li>
                    <li style={navItemStyles}><Link to="/museum/events" style={linkStyles}>Manage Events</Link></li>
                    <li style={navItemStyles}><Link to="/museum-logout" style={linkStyles}>Logout</Link></li>
                </ul>
            </nav>
        </header>
    );
};


const headerStyles = {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '10px 0',
    textAlign: 'center',
};

const titleStyles = {
    margin: '0', // Remove default margin
    fontSize: '24px', // Increase font size for the title
};

const navStyles = {
    listStyleType: 'none',
    padding: '0',
    margin: '10px 0 0 0', // Add margin to separate title from nav
    display: 'flex', // Use flexbox for horizontal layout
    justifyContent: 'center', // Center align items
};

const navItemStyles = {
    margin: '0 15px', // Add space between items
};

const linkStyles = {
    color: 'white', // Link color
    textDecoration: 'none', // Remove underline from links
    padding: '5px 10px', // Add padding for clickable area
    borderRadius: '5px', // Rounded corners
    transition: 'background-color 0.3s', // Smooth transition for hover effect
};

const hoverStyle = {
    backgroundColor: '#495057', // Darker background on hover
};

export default MuseumHeader;
