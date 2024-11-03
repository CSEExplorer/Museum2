import React, { useState,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
const apiUrl = process.env.REACT_APP_API_URL;
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../../contexts/AuthContext";

const LoginWithOTP = () => { 
   const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle sending OTP
  const handleSendOTP = async () => {
    try {
      const response = await axios.post(`${apiUrl}/send_otp/`, { email });
      console.log(response.data.message);
      if (response.data.sucess) {
        setOTPSent(true);
        setVerificationStatus("OTP sent to your email.");
      } else {
        setVerificationStatus("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setVerificationStatus("Error sending OTP.");
      console.error(error);
    }
  };

  // Function to handle OTP verification
  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${apiUrl}/verify_otp/`, {
        otp: otp,
        email: email, // Send email along with OTP for verification
      });
      console.log("OTP verification successful:", response.data);
      // localStorage.setItem("token", response.data.token);
      login(response.data.token);

      navigate("/"); // Navigate to home after successful login
    } catch (error) {
      console.error("OTP verification failed:", error.response.data);
      setVerificationStatus("Invalid OTP");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="text-center mb-4">Login with OTP</h2>
      <div className="card">
        <div className="card-body">
          {!otpSent ? (
            // Email input card
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-3"
              />
              <button
                onClick={handleSendOTP}
                disabled={!email}
                className="btn btn-primary btn-block"
              >
                Send OTP
              </button>
            </div>
          ) : (
            // OTP input card
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="form-control mb-3"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={!otp}
                className="btn btn-success btn-block"
              >
                Verify OTP
              </button>
            </div>
          )}
          {verificationStatus && (
            <div className="mt-3">
              <p
                className={`text-${
                  verificationStatus.includes("Failed") ? "danger" : "success"
                }`}
              >
                {verificationStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginWithOTP;
