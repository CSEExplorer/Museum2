import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MuseumDashboard = () => {
    const [museumDetails, setMuseumDetails] = useState({
        ticketsAvailable: '',
        ticketPrice: '',
        offers: '',
        timeSlots: '',
        closingDates: '',
        events: '',
        otherOptions: '',
        image: '',
        details: ''
    });

    useEffect(() => {
        // Fetch the initial museum data from the API
        axios.get('/api/museum/details/')
            .then(response => setMuseumDetails(response.data))
            .catch(error => console.log(error));
    }, []);

    const handleUpdate = (field, value) => {
        // Send an update request to the backend
        axios.post('/api/museum/update/', { field, value })
            .then(response => {
                // Update the state with the new value
                setMuseumDetails(prevState => ({
                    ...prevState,
                    [field]: value
                }));
            })
            .catch(error => console.log(error));
    };

    const handleDelete = (field) => {
        // Set the value to empty and send an update request
        handleUpdate(field, '');
    };

    return (
        <div className="container mt-5" style={styles.container}>
            <h1 className="text-center mb-4">Museum Owner Dashboard</h1>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Update Tickets Available</h5>
                            <input 
                                type="number" 
                                className="form-control mb-2"
                                value={museumDetails.ticketsAvailable} 
                                onChange={(e) => handleUpdate('ticketsAvailable', e.target.value)} 
                            />
                            <button className="btn btn-danger" onClick={() => handleDelete('ticketsAvailable')}>Delete</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Change Ticket Price</h5>
                            <input 
                                type="number" 
                                className="form-control mb-2"
                                value={museumDetails.ticketPrice} 
                                onChange={(e) => handleUpdate('ticketPrice', e.target.value)} 
                            />
                            <button className="btn btn-danger" onClick={() => handleDelete('ticketPrice')}>Delete</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Make Offers</h5>
                            <input 
                                type="text" 
                                className="form-control mb-2"
                                value={museumDetails.offers} 
                                onChange={(e) => handleUpdate('offers', e.target.value)} 
                            />
                            <button className="btn btn-danger" onClick={() => handleDelete('offers')}>Delete</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Change Time Slots</h5>
                            <input 
                                type="text" 
                                className="form-control mb-2"
                                value={museumDetails.timeSlots} 
                                onChange={(e) => handleUpdate('timeSlots', e.target.value)} 
                            />
                            <button className="btn btn-danger" onClick={() => handleDelete('timeSlots')}>Delete</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Change Closing Dates</h5>
                            <input 
                                type="text" 
                                className="form-control mb-2"
                                value={museumDetails.closingDates} 
                                onChange={(e) => handleUpdate('closingDates', e.target.value)} 
                            />
                            <button className="btn btn-danger" onClick={() => handleDelete('closingDates')}>Delete</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Organize an Event</h5>
                            <input 
                                type="text" 
                                className="form-control mb-2"
                                value={museumDetails.events} 
                                onChange={(e) => handleUpdate('events', e.target.value)} 
                            />
                            <button className="btn btn-danger" onClick={() => handleDelete('events')}>Delete</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Change Image</h5>
                            <input 
                                type="file" 
                                className="form-control mb-2"
                                onChange={(e) => handleUpdate('image', e.target.files[0])} 
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card" style={styles.card}>
                        <div className="card-body">
                            <h5>Update Museum Details</h5>
                            <textarea 
                                className="form-control mb-2"
                                value={museumDetails.details} 
                                onChange={(e) => handleUpdate('details', e.target.value)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Inline Styles
const styles = {
    container: {
        maxWidth: '1200px',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
    },
};

export default MuseumDashboard;
