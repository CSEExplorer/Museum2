import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const apiUrl = process.env.REACT_APP_API_URL;

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Function to get the CSRF token from cookies
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Send GET request to set CSRF token
      await axios.get(`${apiUrl}/reset_password/`, { withCredentials: true });

      // Step 2: Get the CSRF token
      const csrftoken = getCookie("csrftoken");

      // Step 3: Send POST request with email and CSRF token
      const response = await axios.post(
        `${apiUrl}/password_reset/`,
        { email },
        {
          headers: {
            "X-CSRFToken": csrftoken, // Include CSRF token in headers
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      setMessage(
        "Success! Please check your Gmail for the password reset link."
      );
      setSuccess(true); // Indicating success
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
      setSuccess(false); // Reset in case of failure
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
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="text-center mt-3">
                  <button type="submit" className="btn btn-primary">
                    Send Password Reset Link
                  </button>
                </div>
              </form>
              {message && (
                <div
                  className={`mt-4 alert ${
                    success ? "alert-success" : "alert-danger"
                  }`}
                  role="alert"
                >
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

export default PasswordResetRequest;
