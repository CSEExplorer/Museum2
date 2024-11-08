import React, { useState } from "react";

const ShowAvailability = ({ availabilityData, onFinalBooking }) => {
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  if (!availabilityData) {
    return <p>No availability information available.</p>;
  }

  // Default values for shifts
  let morningShift = { shift_type: "Morning", tickets_available: 0 };
  let eveningShift = { shift_type: "Evening", tickets_available: 0 };

  // Check for morning shift
  const morningData = availabilityData.shifts.find(
    (shift) => shift.shift_type === "Morning"
  );
  if (morningData) {
    morningShift = morningData;
  }

  // Check for evening shift
  const eveningData = availabilityData.shifts.find(
    (shift) => shift.shift_type === "Evening"
  );
  if (eveningData) {
    eveningShift = eveningData;
  }

  const handleBookShift = (shift) => {
    setSelectedShift(shift);
    setSelectedDate(availabilityData.date); // Set the selected date
  };

  const handleCancel = () => {
    setSelectedShift(null);
    setSelectedDate(null); // Reset selected shift and date
  };
  

  return (
    <div style={styles.container}>
      <h3>Shifts Available for {availabilityData.date}</h3>
      <p>
        <strong>Day:</strong> {availabilityData.day || "N/A"}
      </p>
      {availabilityData.is_closed ? (
        <p>The museum is closed on this day.</p>
      ) : (
        <div style={styles.shiftsContainer}>
          <p>
            <strong>Morning Shift:</strong> {morningShift.tickets_available}{" "}
            tickets available
          </p>
          {morningShift.tickets_available > 0 && (
            <button onClick={() => handleBookShift(morningShift)}>
              Book Morning
            </button>
          )}
          <p>
            <strong>Evening Shift:</strong> {eveningShift.tickets_available}{" "}
            tickets available
          </p>
          {eveningShift.tickets_available > 0 && (
            <button onClick={() => handleBookShift(eveningShift)}>
              Book Evening
            </button>
          )}
        </div>
      )}

      {/* Show selected shift and date if a shift has been selected */}
      {selectedShift && (
        <div style={styles.selectedContainer}>
          <p>
            <strong>Selected Shift:</strong> {selectedShift.shift_type}
          </p>
          <p>
            <strong>Selected Date:</strong> {selectedDate}
          </p>
          <button onClick={handleCancel}>Cancel Selection</button>
        </div>
      )}
      {selectedShift && (
        <div style={styles.finalBookingContainer}>
          <button onClick={()=> onFinalBooking(selectedDate,selectedShift)}>Final Booking</button>
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
    maxWidth: "300px",
    margin: "auto",
  },
  shiftsContainer: {
    marginTop: "10px",
  },
  selectedContainer: {
    marginTop: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  finalBookingContainer: {
    marginTop: "15px",
  },
};

export default ShowAvailability;
