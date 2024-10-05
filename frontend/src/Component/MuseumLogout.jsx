import React, { useEffect,useContext,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RoleContext } from '../contexts/RoleProvider';
const apiUrl = process.env.REACT_APP_API_URL; // Your API URL

const Logout = () => {
        const { changeRole } = useContext(RoleContext); 
    const navigate = useNavigate();
    const hasLoggedOut = useRef(false); // Use ref to prevent double logout in development

    useEffect(() => {
        const handleLogout = async () => {
            // Prevent running the logout process more than once
            if (hasLoggedOut.current) return;
            
            hasLoggedOut.current = true;

            // Confirm logout with the user
            const confirmed = window.confirm('Are you sure you want to log out?');

            if (!confirmed) {
                return; // Do nothing if the user cancels
            }

            try {
                const token = localStorage.getItem('token');

                // Check if token exists
                if (!token) {
                    console.warn('No token found. User might not be logged in.');
                    navigate('/'); // Navigate to login if no token
                    return;
                }

                // Make the logout request
                await axios.post(`${apiUrl}/museums/logout/`, null, {
                    headers: {
                        Authorization: `Token ${token}`, // Get token from local storage
                    },
                });

                // Remove the token and role from local storage only after a successful logout
                localStorage.removeItem('token');
                 changeRole('user');  // R

                // Redirect to the museum login page
                navigate('/');
            } catch{
                // Log detailed error
                console.error('Logout failed:', error.response ? error.response.data : error.message);
            }
        };

        handleLogout(); // Call the logout function
    }, [navigate]);

    return null; // Render nothing while processing
};

export default Logout;
