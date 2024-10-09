import React, { useState } from 'react';
import { useMuseum } from '../contexts/MuseumContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Availability.css'; // Assuming you already have styles

const Availability = () => {
  const { museumData, updateAvailability } = useMuseum(); // Get museumData and update function from context
  const [currentMonth, setCurrentMonth] = useState(9); // Default to October
  const [currentYear] = useState(2024); // Fixed year
  const [selectedDay, setSelectedDay] = useState(null); // Track selected day
  const [updatedData, setUpdatedData] = useState({}); // Store changes
  const [changes, setChanges] = useState({}); // State to track all changes

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

  const handleDayClick = (day, dateString) => {
    setSelectedDay({ day, dateString });
  };

  const handleShiftChange = (date, shiftId, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [date]: {
        ...prevData[date],
        [shiftId]: value
      }
    }));
    setChanges((prevChanges) => ({
      ...prevChanges,
      [date]: {
        ...prevChanges[date],
        [shiftId]: value
      }
    }));
  };

  const handleDeleteShift = (date, shiftId) => {
    setUpdatedData((prevData) => {
      const newData = { ...prevData };
      if (newData[date]) delete newData[date][shiftId];
      return newData;
    });
    setChanges((prevChanges) => {
      const newChanges = { ...prevChanges };
      if (newChanges[date]) delete newChanges[date][shiftId];
      return newChanges;
    });
  };

  const handleSaveChanges = () => {
    // Call the updateAvailability function or make API call
    updateAvailability(changes);
    alert('Changes saved successfully!');
    setChanges({});
    setSelectedDay(null); // Close the editing form after saving
  };

  const getDefaultShifts = (dayAvailability) => {
    if (!dayAvailability || dayAvailability.is_closed) return null;

    const shifts = [
      { id: 'morning', shift_type: 'Morning', tickets_available: 0 },
      { id: 'evening', shift_type: 'Evening', tickets_available: 0 }
    ];

    // Update the default shifts with any existing availability data
    if (dayAvailability) {
      dayAvailability.shifts.forEach((existingShift) => {
        const defaultShift = shifts.find(shift => shift.id === existingShift.shift_type.toLowerCase());
        if (defaultShift) {
          defaultShift.tickets_available = existingShift.tickets_available;
        }
      });
    }

    return shifts;
  };

  const renderDays = () => {
  const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  return currentMonthDays.map((day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAvailability = museumData.availabilities.find((avail) => avail.date === dateString);

    return (
      <div
        key={day}
        className={`calendar-day ${dayAvailability ? 'available-day' : ''}`} // Yellow if availability exists
        style={dayAvailability ? { backgroundColor: 'yellow' } : {}}
        onClick={() => handleDayClick(day, dateString)} // Click event
      >
        <div className="day-number">{day}</div>
        <div className="day-name">{new Date(dateString).toLocaleString('default', { weekday: 'long' })}</div>
      </div>
    );
  });
};


  const renderEditForm = () => {
    if (!selectedDay) return null;

    const { dateString } = selectedDay;
    const dayAvailability = museumData.availabilities.find((avail) => avail.date === dateString);

    if (dayAvailability?.is_closed) {
      return <p>This day is closed.</p>;
    }

    const shifts = getDefaultShifts(dayAvailability);

    return (
      <div className="edit-form">
        <h3>Edit Availability for {dateString}</h3>
        {shifts && shifts.map((shift) => (
          <div key={shift.id} className="form-group">
            <label>{shift.shift_type} Tickets Available:</label>
            <input
              type="number"
              className="form-control"
              value={updatedData[dateString]?.[shift.id] || shift.tickets_available}
              onChange={(e) => handleShiftChange(dateString, shift.id, e.target.value)}
            />
            <button
              className="btn btn-danger mt-2"
              onClick={() => handleDeleteShift(dateString, shift.id)}
            >
              Delete {shift.shift_type} Shift
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (!museumData || !museumData.availabilities) {
    return <p>Loading availability data...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Availability Calendar for {museumData.name}</h1>
      
      <div className="d-flex justify-content-center align-items-center mb-4">
        <button className="btn btn-secondary" onClick={handlePreviousMonth}>Previous</button>
        <h2 className="mx-4">{months[currentMonth]} {currentYear}</h2>
        <button className="btn btn-secondary" onClick={handleNextMonth}>Next</button>
      </div>

      <div className="calendar">
        <div className="row">
          {renderDays()}
        </div>
      </div>

      {renderEditForm()}

      {selectedDay && (
        <div className="fixed-bottom mb-3 text-center">
          <button className="btn btn-primary" onClick={handleSaveChanges}>Final Save</button>
        </div>
      )}
    </div>
  );
};

export default Availability;
