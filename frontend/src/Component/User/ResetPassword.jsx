import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = process.env.REACT_APP_API_URL; // Ensure this is set in your .env file

const ResetPassword = () => {
  const { uid, token } = useParams();
  console.log(token)  // Get uid and token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false); // Track success for redirection message
  const navigate = useNavigate(); // For redirection after success

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Construct the URL for the password reset confirmation
      const response = await axios.post(`${apiUrl}/reset/${uid}/${token}/`, {
        password  // Only send the new password in the body
      });
      
      setMessage("Password reset successful! Redirecting to login...");
      setSuccess(true);  // Set success to true
      setTimeout(() => {
        navigate('/login');  // Redirect to login after 3 seconds
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred.");
      setSuccess(false);  // Reset success if failed
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>Reset Your Password</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </div>
              </form>
              {message && (
                <div className={`mt-4 alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
