import React, { useState } from 'react';
import { useMuseum } from '../contexts/MuseumContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Availability.css'; // Assuming you already have styles

const Availability = () => {
  const { museumData, updateAvailability } = useMuseum();
  
  const [currentMonth, setCurrentMonth] = useState(9); // Default to October
  const [currentYear] = useState(2024); // Fixed year
  const [selectedDay, setSelectedDay] = useState(null); // Track selected day
  const [updatedData, setUpdatedData] = useState({}); // Store changes
  const [deletedShifts, setDeletedShifts] = useState([]); // Store deleted shift IDs

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
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setSelectedDay(null);
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
  };

  const handleDeleteShift = (date, shiftId) => {
    setUpdatedData((prevData) => {
      const newData = { ...prevData };
      if (newData[date]) delete newData[date][shiftId];
      return newData;
    });
    setDeletedShifts((prevDeleted) => [...prevDeleted, shiftId]);
  };

  const handleUpdateShift = (date, shiftId) => {
    // This function can be used to update the shift in the updatedData state
    const updatedShiftValue = updatedData[date]?.[shiftId] || 0; // Default to 0 if no value
    console.log(`Updating ${shiftId} on ${date} to ${updatedShiftValue}`);
  };

  const handleSaveChanges = () => {
  // Prepare the data to send to the backend
  const requestData = {
    museum_id: 11, // Include the museum ID as needed
    updates: {},
    deletes: deletedShifts, // Include the deleted shift IDs
    };
    

  // Prepare updates by iterating through updatedData
  for (const date in updatedData) {
    if (!requestData.updates[date]) {
      requestData.updates[date] = {};
    }
    for (const shiftId in updatedData[date]) {
      requestData.updates[date][shiftId] = updatedData[date][shiftId]; // Store ticket availability by shift ID
    }
    }
    console.log(JSON.stringify(requestData));
    
  
  fetch('YOUR_BACKEND_URL/api/availability', {
    method: 'PUT', // or 'PATCH' based on your API design
    headers: {
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify(requestData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Changes saved successfully!');
      setUpdatedData({});
      setDeletedShifts([]); 
      setSelectedDay(null); 
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to save changes. Please try again.');
    });
};


 const getDefaultShifts = (dayAvailability) => {
  if (!dayAvailability || dayAvailability.is_closed) return null;

  const defaultShifts = [
    { id: 'morning', shift_type: 'Morning' },
    { id: 'evening', shift_type: 'Evening' }
  ];

  // If there is availability data, match the shift id from the museumData
  const shifts = defaultShifts.map(defaultShift => {
    const matchingShift = dayAvailability.shifts.find(
      shift => shift.shift_type.toLowerCase() === defaultShift.shift_type.toLowerCase()
    );
    
    // If a match is found, set the id to the actual shift id, otherwise keep it as default
    if (matchingShift) {
      return {
        ...defaultShift,
        id: matchingShift.id, // Use the unique shift ID from museumData
        tickets_available: matchingShift.tickets_available // Include tickets available if it exists
      };
    }

    // If no match is found, return the default shift structure
    return {
      ...defaultShift,
      tickets_available: 0 // Default to 0 tickets available
    };
  });

  return shifts;
};

    // Update the default shifts with any existing availability data
  

  const renderDays = () => {
    const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    const currentMonthDays = [];
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      currentMonthDays.push(i);
    }

    return currentMonthDays.map((day) => {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAvailability = museumData.availabilities.find((avail) => avail.date === dateString);
      return (
        <div
          key={day}
          className={`calendar-day ${dayAvailability ? 'available-day' : ''}`} // Yellow if availability exists
          style={dayAvailability ? { backgroundColor: 'yellow' } : {}}
          onClick={() => handleDayClick(day, dateString)} 
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
              defaultValue={0} // Start with 0
              onChange={(e) => handleShiftChange(dateString, shift.id, e.target.value)}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={() => handleUpdateShift(dateString, shift.id)}
            >
              Update {shift.shift_type} Shift
            </button>
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
        <button className="btn btn-secondary" onClick={handlePreviousMonth}>Previous Month</button>
        <h2 className="mx-4">{months[currentMonth]} {currentYear}</h2>
        <button className="btn btn-secondary" onClick={handleNextMonth}>Next Month </button>
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
