import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;
const Booking = ({ order, bookingDetail, museumDetails,onresetChat }) => {
  const { email, amount, id } = order;
  const [loading, setLoading] = useState(false);
  const [message, setmessage] = useState("");
  console.log(bookingDetail);
  console.log(museumDetails.museum_id);
  
  
  // Handle Razorpay payment logic
  const handlePayment = async () => {
    
    if (typeof window.Razorpay === "undefined") {
      alert(
        "Razorpay SDK is not loaded. Please check your connection or script inclusion."
      );
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY, // Razorpay Key ID from .env
      amount: amount, // Amount in paise
      currency: "INR",
      name: museumDetails.name,
      description: "Museum Ticket Booking",
      order_id: id,
      handler: async (response) => {
        try {
          // After successful payment, verify payment
          await axios.post(`${process.env.REACT_APP_API_URL}/verify_payment/`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            email: email, // Include email to send booking confirmation
          });

          console.log("Email sending process started...");
          // Send booking confirmation email
          const emailResponse = await axios.post(
            `${apiUrl}/send_mail/`,
            {
              email:email,
              selectedShifts:bookingDetail,
              fare:amount,
              id:museumDetails.museum_id,
            }
          );

          console.log("Email sent response:", emailResponse.data);
          setmessage("Email Sent Sucessfully ");
          alert("Payment successful! Booking confirmed.");
        } catch (error) {
          // Log the error response
          console.error("Error during payment processing:", error);
        }
      },
      prefill: {
        email: email,
        contact: "9999999999", // Example contact, can be dynamically set
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div>
      <h2>Booking for {museumDetails.name}</h2>
      <p>Total Fare: ₹{amount / 100}</p> <p>Booking for : {bookingDetail}</p>{" "}
      <div>
        {!loading && (
          <button onClick={handlePayment}>Proceed to Payment</button>
        )}
        {loading && <p>Processing payment...</p>}{" "}
        <button onClick={()=>onresetChat()}>Cancel</button>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
};


export default Booking;
