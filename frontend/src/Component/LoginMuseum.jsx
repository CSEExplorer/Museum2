import React, { useState,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../contexts/RoleProvider';
const apiUrl = process.env.REACT_APP_API_URL;

const LoginMuseum = () => {
    const { changeRole } = useContext(RoleContext); 
    //destructurieng the RoleContext;
    const [uniqueId, setUniqueId] = useState(''); // State for unique ID
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await axios.post(`${apiUrl}/museums/login/`, {
                unique_id: uniqueId,
                password: password,
            });
            // Store token or user info as needed
              if (response.data.token) {
            // Store token and role
            localStorage.setItem('token', response.data.token);
          
            changeRole('admin');  
            

            setMessage('Login successful!');
            setErrors({});
            
            // Redirect to the museum dashboard
            navigate('/museum-dashboard');
        } else {
            setErrors({ general: 'Login failed. Token not found.' });
        }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Login failed. Please try again.' });
            }
            setMessage('');
        }
    };

    // Inline styles
    const styles = {
        container: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backgroundColor: '#FFE4B5', // Peach color
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
            color: '#D2691E', // Darker shade for header
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#FF7F50', // Coral color for button
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        alertSuccess: {
            color: 'green',
            textAlign: 'center',
            marginBottom: '10px',
        },
        alertError: {
            color: 'red',
            textAlign: 'center',
            marginBottom: '10px',
        },
        error: {
            color: 'red',
            fontSize: '0.8em',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Login as Museum Owner</h2>
            {message && <div style={styles.alertSuccess}>{message}</div>}
            {errors.general && <div style={styles.alertError}>{errors.general}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="exampleInputUniqueId" className="form-label">Unique ID</label>
                    <input
                        type="text"
                        style={styles.input}
                        id="exampleInputUniqueId"
                        placeholder="Enter your unique ID"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                    />
                    {errors.unique_id && <p style={styles.error}>{errors.unique_id}</p>}
                </div>
                <div>
                    <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        style={styles.input}
                        id="exampleInputPassword"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p style={styles.error}>{errors.password}</p>}
                </div>
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginMuseum;
