import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const SignupMuseum = () => {
    const [name, setName] = useState('');  // Museum name (maps to serializer's "name" field)
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');  // Added for email field
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await axios.post(`${apiUrl}/museums/signup/`, {
                name: name,  // Sending the "name" field expected by the serializer
                contact_number: contactNumber,
                email: email,  // Email field
                password: password,  // Password field (write-only)
            });

            setMessage('Museum signup successful! You can now log in.');
            setErrors({});
            setTimeout(() => navigate('/museum-login'), 2000);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Signup failed. Please try again.' });
            }
            setMessage('');
        }
    };

    // Inline styles object
    const styles = {
        container: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#FAEBEB',
        },
        title: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        button: {
            backgroundColor: '#007bff',
            border: 'none',
            color: '#fff',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
        },
        error: {
            color: 'red',
            fontSize: '0.9em',
        },
        successMessage: {
            color: 'green',
            margin: '10px 0',
        },
        generalError: {
            color: 'red',
            margin: '10px 0',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Sign Up as Museum</h2>
            {message && <div style={styles.successMessage}>{message}</div>}
            {errors.general && <div style={styles.generalError}>{errors.general}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Museum Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your museum name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p style={styles.error}>{errors.name}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="contactNumber"
                        placeholder="Enter your contact number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                    />
                    {errors.contact_number && <p style={styles.error}>{errors.contact_number}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p style={styles.error}>{errors.email}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p style={styles.error}>{errors.password}</p>}
                </div>
                <button 
                    type="submit" 
                    style={styles.button}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupMuseum;
