import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateTicket = () => {
  const [ticketData, setTicketData] = useState({
    morningTickets: 0,
    eveningTickets: 0,
    Price: 0,
   
  });

  const [formData, setFormData] = useState({
    morningTickets: 0,
    eveningTickets: 0,
      Price: 0,
  });

 
  useEffect(() => {
    fetchTicketData();
  }, []);

  const fetchTicketData = async () => {
    try {
      const response = await axios.get("/api/ticket-data");
      setTicketData(response.data);
      setFormData(response.data); 
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateTicketAvailability = async () => {
    try {
      await axios.put("/api/update-ticket-availability", {
        morningTickets: formData.morningTickets,
        eveningTickets: formData.eveningTickets,
      });
      alert("Ticket availability updated successfully!");
      fetchTicketData(); // Refresh ticket data after update
    } catch (error) {
      console.error("Error updating ticket availability:", error);
    }
  };

  const updateTicketPrice = async () => {
    try {
      await axios.put("/api/update-ticket-price", {
        morningPrice: formData.morningPrice,
        eveningPrice: formData.eveningPrice,
      });
      alert("Ticket price updated successfully!");
      fetchTicketData(); // Refresh ticket data after update
    } catch (error) {
      console.error("Error updating ticket price:", error);
    }
  };

  return (
    <div>
      <h2>Update Ticket Availability & Prices</h2>

      <div>
        <h3>Available Tickets</h3>
        <p>Morning: {ticketData.morningTickets}</p>
        <p>Evening: {ticketData.eveningTickets}</p>

        <label>
          Edit Morning Tickets:
          <input
            type="number"
            name="morningTickets"
            value={formData.morningTickets}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Edit Evening Tickets:
          <input
            type="number"
            name="eveningTickets"
            value={formData.eveningTickets}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={updateTicketAvailability}>Update Ticket Availability</button>
      </div>

      <div>
        <h3>Ticket Prices</h3>
        <p>Morning Price: ${ticketData.morningPrice}</p>
        <p>Evening Price: ${ticketData.eveningPrice}</p>

        <label>
          Edit Morning Price:
          <input
            type="number"
            name="morningPrice"
            value={formData.morningPrice}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Edit Evening Price:
          <input
            type="number"
            name="eveningPrice"
            value={formData.eveningPrice}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={updateTicketPrice}>Update Ticket Price</button>
      </div>
    </div>
  );
};

export default UpdateTicket;
