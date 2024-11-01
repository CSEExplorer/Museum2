import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login
    try {
      const response = await axios.post(`${apiUrl}/login/`, {
        username: email,
        password: password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response.data);
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
      <div className="text-center mt-3">
        <p>Or</p>
        <Link
          to="/login-with-otp"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          Login with OTP
        </Link>
      </div>
    </div>
  );
};

export default Login;
