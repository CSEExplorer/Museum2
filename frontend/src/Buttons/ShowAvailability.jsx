import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Using for react-router-dom v6
import 'react-calendar/dist/Calendar.css';
import './ShowAvailability.css';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const ShowAvailability = () => {
    const { museumId } = useParams(); 
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // for navigation
    const [currentMonth, setCurrentMonth] = useState(10); // Default to October
    const [currentYear] = useState(2024); // Fixed year
    const [selectedDay, setSelectedDay] = useState(null); // Track selected day

    useEffect(() => {
        // console.log("museumId:", museumId);
        // console.log("currentMonth:", currentMonth);
        // Fetch availability from the backend
        // console.log(`${apiUrl}/museums/${museumId}/availabilities/${currentMonth}/`); // Log the URL
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

    const handleDayClick = (day, dateString) => {
        setSelectedDay({ day, dateString });
    };

    const handleSaveChanges = () => {
        // Send selected date to booking page
        navigate(`/booking/${museumId}`);
    };

    const renderDays = () => {
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        const currentMonthDays = [];
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            currentMonthDays.push(i);
        }
    
        return currentMonthDays.map((day) => {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            // console.log(dateString)
            const dayAvailability = availability.find((avail) => avail.date === dateString);
            // console.log(dayAvailability);
            // Apply yellow for available days and red for closed days
            let dayClass = '';
            if (dayAvailability) {
                if (!dayAvailability.is_closed) {
                    dayClass = 'available-day'; // Yellow
                } else  {
                    dayClass = 'closed-day'; // Red
                }
            }
    
            return (
                <div
                    key={day}
                    className={`calendar-day ${dayClass}`} // Apply class based on availability
                    onClick={() => handleDayClick(day, dateString)}
                >
                    <div className="day-number">{day}</div>
                    <div className="day-name">{new Date(dateString).toLocaleString('default', { weekday: 'long' })}</div>
                </div>
            );
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Availability Calendar for Museum : {museumId}</h1>

            <div className="d-flex justify-content-center align-items-center mb-4">
                <button className="btn btn-secondary" onClick={handlePreviousMonth}>Previous Month</button>
                <h2 className="mx-4">{months[currentMonth]} {currentYear}</h2>
                <button className="btn btn-secondary" onClick={handleNextMonth}>Next Month</button>
            </div>

            <div className="calendar">
                <div className="row">
                    {renderDays()}
                </div>
            </div>

            {selectedDay && (
                <div className="fixed-bottom mb-3 text-center">
                    <button className="btn btn-primary" onClick={handleSaveChanges}>Final Save</button>
                </div>
            )}
        </div>
    );
};

export default ShowAvailability;
