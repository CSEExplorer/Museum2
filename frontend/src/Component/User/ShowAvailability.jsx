import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Using for react-router-dom v6
import 'react-calendar/dist/Calendar.css';
import "../../Css/User/ShowAvailability.css";
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const ShowAvailability = () => {
    const { museumId } = useParams(); 
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // for navigation
    const [currentMonth, setCurrentMonth] = useState(10); // Default to October
    const [currentYear] = useState(2024); // Fixed year
    const [selectedShifts, setSelectedShifts] = useState([]);
    const [selectedDay, setSelectedDay] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal state





   
    useEffect(() => {
       
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`${apiUrl}/museums/${museumId}/availabilities/${currentMonth+1}/`);
                setAvailability(response.data);
                // console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching availability:', error);
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [museumId,currentMonth]);

   

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

  

    const handleSaveChanges = () => {
        setIsModalVisible(true); // Show the confirmation modal
    };

    const handleShiftClick = (shiftType, date) => {
       
        const shiftKey = `${shiftType}-${date}`;
        if (selectedShifts.includes(shiftKey)) {
            setSelectedShifts((prev) => {
                const newShifts = prev.filter((shift) => shift !== shiftKey);
                
                return newShifts;
            });
        } else {
            setSelectedShifts((prev) => {
                const newShifts = [...prev, shiftKey];
              
                return newShifts;
            });
        }
    };

    const renderDays = () => {
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        const currentMonthDays = [];
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            currentMonthDays.push(i);
        }
    
        return currentMonthDays.map((day) => {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAvailability = availability.find((avail) => avail.date === dateString);
    
            // Apply styles based on availability
            let dayClass = '';
            if (dayAvailability) {
                dayClass = dayAvailability.is_closed ? 'closed-day' : 'available-day'; // Apply styles based on availability
            }
    
            // Fetch shifts for the day
            const morningShift = dayAvailability?.shifts.find(shift => shift.shift_type === 'Morning');
            const eveningShift = dayAvailability?.shifts.find(shift => shift.shift_type === 'Evening');
            // const isExpanded = expandedDay === dateString;
            return (
                <div
                    key={day}
                    className={`calendar-day ${dayClass}`} // Main card for day and date
                    // onClick={() => handleDayClick(dayAvailability)}

                >
                    <div className="day-header">
                        <div className="day-number">{day}</div>
                        <div className="day-name">{new Date(dateString).toLocaleString('default', { weekday: 'long' })}</div>
                    </div>
                   
                   {dayAvailability && !dayAvailability.is_closed && (
    <div className="shifts-container">
        <div 
            className={`shift-card morning-card ${selectedShifts.includes(`Morning-${dateString}`) ? 'selected' : ''}`}
            onClick={() => handleShiftClick('Morning', dateString)}
        >
            <div className="shift-title">M</div>
            <div className="available-tickets">
                {morningShift ? morningShift.tickets_available : 0} 
            </div>
        </div>
        <div 
           className={`shift-card evening-card ${selectedShifts.includes(`Evening-${dateString}`) ? 'selected' : ''}`}
            onClick={() => handleShiftClick('Evening', dateString)}
        >
            <div className="shift-title">E</div>
            <div className="available-tickets">
                {eveningShift ? eveningShift.tickets_available : 0}
            </div>
        </div>
    </div>
)}
                </div>
            );
    
        });
    
    };

    const ConfirmationModal = ({ isVisible, onClose }) => {
        if (!isVisible) return null;

        return (
            <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Your Shifts</h5>
                            <button className="close" onClick={onClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h5>Saved Shifts:</h5>
                            <ul className="list-group">
                                {selectedShifts.map((shift, index) => (
                                    <li key={index} className="list-group-item">
                                        {shift}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    navigate(`/booking/${museumId}` , { state: { selectedShifts } });
                                    onClose();
                                }}
                            >
                                Confirm and Proceed to Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    
    

    return (
        
        <div className="container mt-75">
            <h1 className="text-center mb-4">Availability Calendar for Museum : {museumId}</h1>
 
            <div className="d-flex justify-content-center align-items-center mb-4">
                <button className="btn btn-secondary" onClick={handlePreviousMonth}>Previous Month</button>
                <h2 className="mx-4">{months[currentMonth]} {currentYear}</h2>
                <button className="btn btn-secondary" onClick={handleNextMonth}>Next Month</button>
            </div>
            <h4>M-Morning , E-Evening</h4>
            <div className="calendar">
                <div className="row">
                    {renderDays()}
                </div>
            </div>
            
            {selectedShifts.length > 0 && (
    <div className="fixed-bottom mb-3 text-center">
        <button className="btn btn-primary" onClick={() => setIsModalVisible(true)}>
            Final Save
        </button>
    </div>
    
)}



            {isModalVisible && (
    <ConfirmationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleSaveChanges}
    />
)}
        </div>
        
    );
};


export default ShowAvailability;
