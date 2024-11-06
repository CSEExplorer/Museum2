// ActionButtons.jsx
import React from "react";

const ActionButtons = ({ onCancelBooking, onBookNow }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <button onClick={onCancelBooking} style={buttonStyles}>
        Cancel Booking
      </button>
      <button onClick={onBookNow} style={buttonStyles}>
        Book Now.
      </button>
    </div>
  );
};

const buttonStyles = {
  padding: "10px 15px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ActionButtons;
