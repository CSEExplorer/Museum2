import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const MuseumDashboard = () => {
    return (
     

            <div className="container mt-5" style={styles.container}>
                <h1 className="text-center mb-4">Museum Owner Dashboard</h1>
                <div className="row">
                    {/* Each section of the dashboard as a card */}
                    <div className="col-md-6 mb-3">
                        <div className="card" style={styles.card}>
                            <div className="card-body">
                                <h5>Update Tickets Available</h5>
                                <Link to="/tickets" className="btn btn-primary">Go to Update</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card" style={styles.card}>
                            <div className="card-body">
                                <h5>Change Ticket Price</h5>
                                <Link to="/ticket-price" className="btn btn-primary">Go to Update</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card" style={styles.card}>
                            <div className="card-body">
                                <h5>Manage Offers</h5>
                                <Link to="/offers" className="btn btn-primary">Go to Update</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card" style={styles.card}>
                            <div className="card-body">
                                <h5>Change Time Slots</h5>
                                <Link to="/time-slots" className="btn btn-primary">Go to Update</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card" style={styles.card}>
                            <div className="card-body">
                                <h5>Organize Events</h5>
                                <Link to="/events" className="btn btn-primary">Go to Update</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card" style={styles.card}>
                            <div className="card-body">
                                <h5>Update Museum Details</h5>
                                <Link to="/details" className="btn btn-primary">Go to Update</Link>
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
