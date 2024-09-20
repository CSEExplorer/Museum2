



// -----------------------------------------------------------------------login with email otp -------------------------------------------------------------------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');  // State for OTP
    const [isOtpStep, setIsOtpStep] = useState(false);  // Flag for OTP step
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isOtpStep) {
            // Handle OTP verification
            try {
                const response = await axios.post('http://localhost:8000/api/verify_otp/', {
                    otp: otp,
                    email: email  // Send email along with OTP for verification
                });
                console.log('OTP verification successful:', response.data);
                localStorage.setItem('token', response.data.token);
                navigate('/profile');
            } catch (error) {
                console.error('OTP verification failed:', error.response.data);
                setError('Invalid OTP');
            }
        } else {
            // Handle initial login
            try {
                const response = await axios.post('http://localhost:8000/api/login/', {
                    username: email,
                    password: password
                });
                console.log('OTP sent:', response.data);
                setIsOtpStep(true);
            } catch (error) {
                console.error('Login failed:', error.response.data);
                setError('Invalid email or password');
            }
        }
    };

    return (
        <div style={containerStyle}>
            <h2 className="text-center mb-4">{isOtpStep ? 'Enter OTP' : 'Login'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {!isOtpStep ? (
                    <>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="exampleInputPassword1"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div className="mb-3">
                        <label htmlFor="exampleInputOtp1" className="form-label">OTP</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputOtp1"
                            placeholder="Enter the OTP sent to your email"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                )}
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    {isOtpStep ? 'Verify OTP' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
