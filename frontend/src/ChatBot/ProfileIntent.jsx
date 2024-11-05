import React from "react";

// ProfileIntent component
const ProfileIntent = ({ profileData }) => {
console.log(profileData);
  return (
    <div style={styles.profileContainer}>
      <h2 style={styles.profileTitle}>Your Profile Information</h2>
      <div style={styles.profileInfo}>
        <p>
          <strong>Name:</strong> {profileData.username || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {profileData.phone_number || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {profileData.address || "N/A"}
        </p>
        <p>
          <strong>City:</strong> {profileData.city || "N/A"}
        </p>
        <p>
          <strong>State:</strong> {profileData.state || "N/A"}
        </p>
      </div>
    </div>
  );
};

// Styles for the ProfileIntent component
const styles = {
  profileContainer: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  profileTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
  },
  profileInfo: {
    fontSize: "16px",
    lineHeight: "1.5",
  },
};

export default ProfileIntent;
