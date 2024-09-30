import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;
const mediaUrl = process.env.REACT_APP_MEDIA_URL;
const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { museum } = location.state || {};
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Received Museum in Booking:', museum);
  }, [museum]);


  
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/museums/${museum.museum_id}/shifts/`);
        setShifts(response.data);
      } catch (err) {
        setError('Failed to fetch shifts. Please try again.');
      }
    };

    if (museum) {
      fetchShifts();
    }
  }, [museum]);

  const handlePayment = async (order) => {
    const { amount, id } = order;
    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK is not loaded. Please check your connection or script inclusion.");
      return;
    }

    const options = {
      key: razorpayKey,  // Razorpay Key ID from .env
      amount: amount,  // Amount in paise
      currency: "INR",
      name: museum.name,
      description: "Museum Ticket Booking",
      order_id: id,
      handler: async (response) => {
        try {
          // After successful payment, verify payment
          await axios.post(`${apiUrl}/verify_payment/`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            email: email,  // Include email to send booking confirmation
            shift_id: selectedShift.id  // Use shift_id
          });

          console.log('Email sending process started...');
          const emailResponse = await axios.post(`${apiUrl}/send_mail/`, {
            email: email,
            shift_id: selectedShift.id,
            id: museum.museum_id

          });

          console.log('Email sent response:', emailResponse.data);
          navigate('/');
          alert('Payment successful! Booking confirmed.');
        } catch (err) {
                 
        }
      },
      prefill: {
        email: email,
        contact: '9999999999',
      },
      theme: {
        color: "#3399cc",
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleConfirmBooking = async () => {
    if (!selectedShift || !email) {
      alert('Please select a shift and provide your email.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please login.');
        navigate('/login');  // Redirect to login if no token
        return;
      }

      // Create Razorpay order
      const response = await axios.post(`${apiUrl}/museums/${museum.museum_id}/create_order/`, {
        amount: museum.fare * 100,  // Ensure amount is in paise (multiply by 100)
        email: email,
      }, {
        headers: {
          Authorization: `Token ${token}`,
        }
      });

      const order = response.data;  // Get order_id from the backend
      handlePayment(order);  // Initiate payment
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {museum ? (
        <>
          <h1 className="mt-4">Book Ticket for {museum.name}</h1>
          <h5>Select a Shift (Morning/Evening):</h5>

          {shifts.length > 0 ? (
            <ul className="list-group">
              {shifts.map((shift) => (
                <li
                  key={shift.shift_type}
                  className={`list-group-item ${selectedShift && selectedShift.shift_type === shift.shift_type ? 'active' : ''}`}
                  onClick={() => setSelectedShift(shift)}
                  style={{ cursor: 'pointer' }}
                >
                  {shift.shift_type.charAt(0).toUpperCase() + shift.shift_type.slice(1)} Shift (Tickets Available: {shift.tickets_available})
                </li>
              ))}
            </ul>
          ) : (
            <p>No available shifts</p>
          )}

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleConfirmBooking}
            disabled={!selectedShift || !email || loading}
          >
            {loading ? 'Booking...' : 'Book Ticket'}
          </Button>
        </>
      ) : (
        <p>No museum selected</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Booking;
