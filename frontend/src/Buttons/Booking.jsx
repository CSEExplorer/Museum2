import React, { useState, useEffect } from 'react';
import { useParams,useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button,Card, Form } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;
const mediaUrl = process.env.REACT_APP_MEDIA_URL;
const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
const Booking = ({museumDetails}) => {
  // console.log(museumDetails);
 
  const location = useLocation();
  const { museumId } = useParams();
  const navigate = useNavigate();
  const { selectedShifts } = location.state || {};
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const farePerShift =museumDetails.fare;
  const totalFare =  selectedShifts.length * farePerShift;
 

  


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
      name: museumDetails.name,
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
          });

          console.log('Email sending process started...');
          // console.log(totalFare);
          const emailResponse = await axios.post(`${apiUrl}/send_mail/`, {
            email: email,
            selectedShifts: selectedShifts,
            fare:totalFare,
            id: museumId,

          });

          console.log('Email sent response:', emailResponse.data);
          navigate('/');
          alert('Payment successful! Booking confirmed.');
        } catch (error) {
          // Log the error response
          if (error.response) {
              console.error('Error response data:', error.response.data); // Log the response data
              console.error('Error status:', error.response.status);
              console.error('Error headers:', error.response.headers);
          } else if (error.request) {
              console.error('No response received:', error.request);
          } else {
              console.error('Error setting up request:', error.message);
          }
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
    if (selectedShifts.length==0 || !email) {
      alert('Please select a shift and provide your email.');
      navigate(`/availability/${museumId}`);
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
      try {
        const response = await axios.post(`${apiUrl}/museums/${museumId}/create_order/`, {
            amount: totalFare*100,
            email: email,
        }, {
            headers: {
                Authorization: `Token ${token}`,
            }
        });
        console.log('Response:', response.data);
        const order = response.data; 
        handlePayment(order); // Log successful response
    } catch (error) {
        console.error('Error during order creation:', error.response ? error.response.data : error.message);
    }

       // Get order_id from the backend
       // Initiate payment
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


const handleCancelBooking = () => {
  navigate(`/availability/${museumId}`);
};



return (
  <div className="container mt-5">
    {selectedShifts && selectedShifts.length > 0 ? (
      <>
        <h1 className="mb-4 text-center">Confirm Your Booking</h1>
        <Card className="p-4 shadow-sm">
          <Card.Body>
            <h3 className="mb-3">Museum: <span className="text-primary">{museumDetails.name}</span></h3>

            {/* Selected Shifts */}
            <h5 className="mb-3">Selected Shifts:</h5>
            <ul className="list-group mb-4">
              {selectedShifts.map((shift, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {shift}
                  <span className="badge bg-primary text-white">Selected</span>
                </li>
              ))}
            </ul>

            {/* Total Fare */}
            <Card className="p-3 mb-4">
              <h4 className="text-center mb-0">Total Fare</h4>
              <h2 className="text-center text-success">₹{totalFare}</h2>
            </Card>

            {/* Email Input */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3"
              />
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="danger"
                className="px-4 py-2"
                onClick={handleCancelBooking} // Cancel action
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                className="px-4 py-2"
                onClick={handleConfirmBooking} // Confirm and Pay action
                disabled={!email || loading}
              >
                {loading ? 'Processing...' : 'Confirm and Pay'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </>
    ) : (
      <p>No shifts selected</p>
    )}
  </div>
);
};

export default Booking;
