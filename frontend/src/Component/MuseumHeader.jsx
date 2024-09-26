import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MuseumHeader = () => {
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to the home page
    };

    return (
        <header className="museum-header">
            <h1>Museum Owner Dashboard</h1>
            <nav>
                <Link to="/change-availability">Change Availability</Link>
                <Link to="/manage-exhibits">Manage Exhibits</Link>
                <button onClick={handleLogout}>Sign Out</button>
            </nav>
        </header>
    );
};

export default MuseumHeader;
