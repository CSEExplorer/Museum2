import React, { useState } from 'react';
import { useMuseum } from '../contexts/MuseumContext'; // Ensure to import your MuseumContext
import 'bootstrap/dist/css/bootstrap.min.css';
import './Availability.css'; // Import your custom CSS for styles

const Availability = () => {
  const { museumData } = useMuseum(); // Get museumData from context
  const [currentMonth, setCurrentMonth] = useState(9); // Default to October (month index 9)
  const [currentYear] = useState(2024); // Fixed year for 2024

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in each month (adjusted for leap years)
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  const renderDays = () => {
    const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

    return currentMonthDays.map((day) => {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; // Construct date string
      const dayAvailability = museumData.availabilities.find((avail) => avail.date === dateString);

      return (
        <div
          key={day}
          className={`calendar-day ${dayAvailability ? (dayAvailability.is_closed ? 'closed-day' : 'available-day') : ''}`}
        >
          <div className="day-number">{day}</div>
          <div className="day-name">{new Date(dateString).toLocaleString('default', { weekday: 'long' })}</div>
          {dayAvailability ? (
            <div className="availability-info">
              <strong>{dayAvailability.is_closed ? 'Closed' : 'Open'}</strong>
              <ul>
                {dayAvailability.shifts.map((shift) => (
                  <li key={shift.id}>
                    {shift.shift_type}: {shift.tickets_available} tickets available
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>No Availability</div>
          )}
        </div>
      );
    });
  };

  if (!museumData || !museumData.availabilities) {
    return <p>Loading availability data...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Availability Calendar for {museumData.name}</h1>
      
      {/* Month Slider Controls */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <button className="btn btn-secondary" onClick={handlePreviousMonth}>Previous</button>
        <h2 className="mx-4">{months[currentMonth]} {currentYear}</h2>
        <button className="btn btn-secondary" onClick={handleNextMonth}>Next</button>
      </div>

      {/* Calendar View for Current Month */}
      <div className="calendar">
        <div className="row">
          {renderDays()}
        </div>
      </div>
    </div>
  );
};

export default Availability;
