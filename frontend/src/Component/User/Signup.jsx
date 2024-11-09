import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
const apiUrl = process.env.REACT_APP_API_URL;

const Signup = () => {
  // State variables for form fields
  const [username, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(""); // Added phone state
  const [address, setAddress] = useState(""); // Retained address field
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Styles for the form container and buttons
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrors({ ...errors, password: "Passwords do not match" });
      return;
    }

    try {
      // API request to signup endpoint
      const response = await axios.post(`${apiUrl}/signup/`, {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone_number: phone, // Include phone in API request
        address: address, // Include address in API request
      });
    //   setMessage("Signup successful! You can now log in.");
      setToastMessage("Signup successful! Redirecting to Login...!");
      setShowToast(true);
      setErrors({});
      
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Handle backend validation errors
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Signup failed. Please try again." });
        setToastMessage({ general: "Signup failed. Please try again." });
        setShowToast(true);
      }
      setMessage("");
      setToastMessage("");
    }
  };

  const checkUsernameAvailability = debounce(async (username) => {
    try {
      const response = await axios.post(`${apiUrl}/check_username/`, {
        username,
      });
      setIsUsernameAvailable(response.data.isAvailable);
    } catch (error) {
      setIsUsernameAvailable(false);
    }
  }, 500);
   
  const checkEmailAvailability = debounce(async (email) => {
    try {
      const response = await axios.post(`${apiUrl}/check_email/`, {
        email,
      });
      setIsEmailAvailable(response.data.isAvailable);
    } catch (error) {
      setIsEmailAvailable(false);
    }
  }, 500); // 500 ms debounce delay

  // Update and check username availability
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUserName(newUsername);
    if (newUsername) {
      checkUsernameAvailability(newUsername);
    } else {
      setIsUsernameAvailable(null);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      checkEmailAvailability(newEmail);
    } else {
      setIsEmailAvailable(null);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 className="text-center mb-4">Sign Up</h2>
      {/* {message && <div className="alert alert-success">{message}</div>} */}
      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputUsername" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputUsername"
            placeholder="E.g: JohnDoe123"
            value={username}
            onChange={handleUsernameChange}
          />
          {isUsernameAvailable === true && (
            <p className="error">
              Username is already present. Try Some other.
            </p>
          )}

          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputFirstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputFirstName"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputLastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputLastName"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          {isEmailAvailable === true && (
            <p className="error">Email already exist.</p>
          )}

          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword" className="form-label">
            Password
          </label>
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
          <label htmlFor="exampleInputConfirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputConfirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPhone" className="form-label">
            Phone Number
          </label>
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
          <label htmlFor="exampleInputAddress" className="form-label">
            Address
          </label>
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
          Sign Up
        </button>
      </form>

      {/* Toast Notification */}
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
    </div>
  );
};

export default Signup;
