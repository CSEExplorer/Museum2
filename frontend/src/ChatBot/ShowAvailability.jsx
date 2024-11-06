import React from "react";

const ShowAvailability = ({ availabilityData  }) => {
  if (!availabilityData || availabilityData.length === 0) {
    return <p>No availability information available.</p>;
  }

  const morningShift = availabilityData.shifts.find(
    (shift) => shift.shift_type === "Morning"
  );
  const eveningShift = availabilityData.shifts.find(
    (shift) => shift.shift_type === "Evening"
  );

  return (
    <div className="availability-card">
      <h3>Availability for {availabilityData.date}</h3>
      <p>
        <strong>Opening Time:</strong> {availabilityData.opening_time}
      </p>
      <p>
        <strong>Closing Time:</strong> {availabilityData.closing_time}
      </p>
      <p>
        <strong>Day:</strong> {availabilityData.day || "N/A"}
      </p>
      {availabilityData.is_closed ? (
        <p>The museum is closed on this day.</p>
      ) : (
        <div className="shift-container">
          <h4>Available Shifts:</h4>
          {morningShift && (
            <p>
              <strong>Morning Shift:</strong> {morningShift.tickets_available}{" "}
              tickets available
            </p>
          )}
          {eveningShift && (
            <p>
              <strong>Evening Shift:</strong> {eveningShift.tickets_available}{" "}
              tickets available
            </p>
          )}
          </div>
       
        
      )}
    </div>
    
  );
};

// Inline styles for the component
const styles = {
  container: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "100px",
    margin: "auto",
  },
  availabilityBox: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "15px",
    marginBottom: "15px",
  },
  shiftsContainer: {
    marginTop: "10px",
  },
  shiftItem: {
    marginBottom: "10px",
  },
};

export default ShowAvailability;
