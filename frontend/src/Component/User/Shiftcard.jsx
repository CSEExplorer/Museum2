// src/components/ShiftCard.jsx

import React, { useState, useEffect } from "react";

const ShiftCard = ({ shiftType, ticketsAvailable, onTicketsChange }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Reset counter to zero when ticketsAvailable changes
    setCounter(0);
  }, [ticketsAvailable]);

  const handleIncrement = () => {
    if (counter < 3 && ticketsAvailable > 0) {
      setCounter((prevCount) => prevCount + 1);
      onTicketsChange(shiftType, ticketsAvailable - 1);
    }
  };

  const handleDecrement = () => {
    if (counter > 0) {
      setCounter((prevCount) => prevCount - 1);
      onTicketsChange(shiftType, ticketsAvailable + 1);
    }
  };

  return (
    <div className="shift-card">
      <div className="shift-title">{shiftType === "Morning" ? "M" : "E"}</div>
      <div className="available-tickets">Available: {ticketsAvailable}</div>
      <div className="counter">
        <button onClick={handleDecrement} disabled={counter === 0}>
          -
        </button>
        <span>{counter}</span>
        <button
          onClick={handleIncrement}
          disabled={counter === 3 || ticketsAvailable === 0}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ShiftCard;
