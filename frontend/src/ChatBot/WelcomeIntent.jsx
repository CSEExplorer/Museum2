import React from "react";

// WelcomeIntent component
const WelcomeIntent = ({ userName }) => {
  console.log(userName);
  return (
    <div style={styles.welcomeContainer}>
      <h2 style={styles.welcomeText}>Hello, {userName}!</h2>
      <p style={styles.instructionText}>How can I help you today?</p>
    </div>
  );
};

// Styles for the WelcomeIntent component
const styles = {
  welcomeContainer: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#e7f3fe",
    color: "#0c5460",
    marginBottom: "10px",
    border: "1px solid #b8daff",
  },
  welcomeText: {
    margin: "0",
    fontSize: "20px",
  },
  instructionText: {
    margin: "5px 0 0",
    fontSize: "16px",
  },
};

export default WelcomeIntent;
