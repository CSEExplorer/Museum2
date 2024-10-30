import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL; 

const Signup = () => {
    // State variables for form fields
    const [username, setUserName] = useState('');
    const[Firstname,setfirstname] = useState('');
    const[Lastname,setlastname] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState(''); // Added phone state
    const [address, setAddress] = useState(''); // Added address state
    const [city, setCity] = useState(''); // Added city state
    const [state, setState] = useState(''); // Added state state
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate(); // Hook for navigation

    // Styles for the form container and buttons
    const containerStyle = {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FAEBEB'
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        border: 'none',
        color: '#fff',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        fontSize: '16px'
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3'
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrors({ ...errors, password: 'Passwords do not match' });
            return;
        }

        try {
            // API request to signup endpoint
            const response = await axios.post(`${apiUrl}/signup/`, {
                username: name,
                email: email,
                password: password,
                phone_number: phone, // Include phone in API request
                address: address, // Include address in API request
                city: city, // Include city in API request
                state: state // Include state in API request
            });
            setMessage('Signup successful! You can now log in.');
            setErrors({});
            // Redirect to login page after successful signup
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                // Handle backend validation errors
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Signup failed. Please try again.' });
            }
            setMessage('');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 className="text-center mb-4">Sign Up</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputName"
                        placeholder="Enter Fisrt name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputConfirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputConfirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {/* New fields added */}
                <div className="mb-3">
                    <label htmlFor="exampleInputPhone" className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputPhone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputAddress" className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputAddress"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className="error">{errors.address}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputCity" className="form-label">City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputCity"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    {errors.city && <p className="error">{errors.city}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputState" className="form-label">State</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputState"
                        placeholder="Enter your state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    {errors.state && <p className="error">{errors.state}</p>}
                </div>
                <button 
                    type="submit" 
                    style={buttonStyle} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
