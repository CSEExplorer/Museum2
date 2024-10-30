import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Import date picker
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import axios

const apiUrl = process.env.REACT_APP_API_URL;
const MuseumAvailability = () => {
    const uniqueId = localStorage.getItem("uniqueId");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [shift, setShift] = useState('Morning');
    const [tickets, setTickets] = useState('');
    const [availabilities, setAvailabilities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddAvailability = () => {
        const dateString = selectedDate.toISOString().split('T')[0];

        const newAvailability = {
            date:dateString,
            shift,
            tickets:parseInt(tickets),
        };

        // Add new availability to the list
        setAvailabilities((prev) => [...prev, newAvailability]);

        // Reset fields after adding
        setSelectedDate(new Date());
        setShift('Morning'); // Reset to default shift
        setTickets(''); // Reset tickets input
    };

    const handleFinalSave = async () => {
    setIsLoading(true); // Set loading state

    // Construct the payload as expected by the backend
    const payload = {
        availability: {
            museum: uniqueId, // Assuming uniqueId is the ID of the museum
            date: availabilities.length > 0 ? availabilities[0].date : '', // Use the first date from availabilities
        },
        shifts: availabilities.map(item => ({
            shift_type: item.shift,
            tickets_available: item.tickets,
        })),
    };

        try {
            console.log(payload);
        await axios.post(`${apiUrl}/museums/addavailabilities/`, payload);

        alert('Availabilities saved successfully!');
        // Optionally reset availabilities after successful save
        setAvailabilities([]);
    } catch (error) {
        console.error('Error saving availabilities:', error);
        alert('Failed to save availabilities. Please try again.');
    } finally {
        setIsLoading(false); // Reset loading state
    }
};

    const handleDeleteAvailability = (index) => {
        const updatedAvailabilities = availabilities.filter((_, i) => i !== index);
        setAvailabilities(updatedAvailabilities);
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4 display-4">Manage Museum Availability</h1>
                    
                    {/* Availability Form Card */}
                    <div className="card mb-4" style={styles.card}>
                        <div className="card-body">
                            <h5 className="text-center display-5">Add Availability</h5>
                            <div className="form-group mb-3">
                                <label className="h6">Select Date:</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="h6">Select Shift:</label>
                                <select
                                    value={shift}
                                    onChange={(e) => setShift(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                            <div className="form-group mb-4">
                                <label className="h6">Number of Tickets:</label>
                                <input
                                    type="number"
                                    value={tickets}
                                    onChange={(e) => setTickets(e.target.value)}
                                    className="form-control"
                                    placeholder="Enter number of tickets"
                                    min="0"
                                />
                            </div>
                            <button className="btn btn-primary btn-block mt-3" onClick={handleAddAvailability}>
                                Add Availability
                            </button>
                        </div>
                    </div>
                    
                    {/* Current Availabilities Section */}
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5 className="text-center display-5">Current Availabilities</h5>
                            {availabilities.length === 0  ? (
                                <p className="text-center">No availabilities added yet.</p>
                            ) : (
                                <div className="list-group">
                                    {availabilities.map((item, index) => (
                                        <div key={index} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{item.date} - {item.shift} Shift</h6>
                                                    <small className="text-muted">Tickets Available: {item.tickets}</small>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteAvailability(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Save Button */}
            <div className="fixed-bottom mb-3" style={{ right: '20px' }}>
                <button
                    className="btn btn-success"
                    onClick={handleFinalSave}
                    disabled={isLoading} // Disable button while loading
                >
                    {isLoading ? 'Saving...' : 'Final Save'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        height: 'auto', // Allow card to stretch vertically
    },
};

export default MuseumAvailability;
