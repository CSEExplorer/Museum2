import React, { useState,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
   const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const containerStyle = {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FAEBEB",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    border: "none",
    color: "#fff",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };
  
const handleLogin = async (response) => {
  const googleToken = response.credential; 

  try {
    // Send the token to your Django backend to authenticate and verify
    const res = await axios.post(`${apiUrl}/google-login/`, {
      token: googleToken, // Send the token to the backend
    });

    if (res.status === 200) {
      setToastMessage("Login Sucessfull. Redirecting to Home page...");
      setShowToast(true);
      login(res.data.token);
      localStorage.setItem("profile_image_url", res.data.profile_picture);
      
      setTimeout(() => navigate("/"), 1000);
      console.log("User authenticated:", res.data);
      
    } else {
      throw new Error("Google login failed on the backend");
    }
  } catch (error) {
    console.error("Google login error:", error.response?.data || error.message);
  }
};

    const handleError = () => {
      setToastMessage("Google Login failed");
      setShowToast(true);
      console.error("Google Login Failed");
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login
    try {
      const response = await axios.post(`${apiUrl}/login/`, {
        username: email,
        password: password,
      });
      setToastMessage("Login Sucessfull. Redirecting to Home page...");
      
      setShowToast(true);
      
      login(response.data.token)
      setTimeout(() => navigate("/"), 1000);
    } 
    catch (error) {
      console.error("Login failed:", error.response.data);
      setToastMessage("Login failed");
      setShowToast(true);
      setError("Invalid email or password");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>
            <Link to="/forget-password">Forgot Password?</Link>
          </p>
        </div>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Login
        </button>
      </form>

      <div
        className={`toast position-fixed top-0 start-50 translate-middle-x mt-3 ${
          showToast ? "show" : "hide"
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-autohide="true"
        style={{
          backgroundColor: "#007bff", // Blue color background
          color: "white", // White text for contrast
          whiteSpace: "nowrap", // Prevents text from wrapping
          padding: "10px 20px",
          borderRadius: "5px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <strong className="me-auto" style={{ marginRight: "auto" }}>
            {toastMessage}
          </strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setShowToast(false)}
            style={{ marginLeft: "10px" }}
          ></button>
        </div>
      </div>

      <div className="text-center mt-3">
        <p>Or</p>
        <Link
          to="/login-with-otp"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          Login with OTP
        </Link>
      </div>
      <div className="text-center mt-3">
        <p>Or</p>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default Login;
