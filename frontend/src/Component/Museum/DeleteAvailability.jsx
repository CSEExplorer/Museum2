import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";
const apiUrl = process.env.REACT_APP_API_URL;
const AvailabilityManager = () => {
  const uniqueId = localStorage.getItem("uniqueId");
  const [deletedItems, setDeletedItems] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [month, setSelectedMonth] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  // Fetch availability data when month changes
  useEffect(() => {
    if (month) {
      fetchAvailability(month);
    }
  }, [month]);

  // Fetch deleted items on mount
  

  // Function to fetch availability data
  const fetchAvailability = async (month) => {
    try {
      const response = await axios.get(`${apiUrl}/museums/giveavailablity/`, {
        params: { month: month, id: uniqueId },
      });
      setAvailabilityData(response.data);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  // Handle delete operation
  const handleDelete = (dayShift) => {
    if (deletedItems.includes(dayShift)) {
      console.log("No change: already deleted.");
      return; // If it's already deleted, do nothing
    } else {
      setItemToDelete(dayShift);
      setShowModal(true);
    }
  };

  // Confirm deletion
  const confirmDelete = () => {
    setDeletedItems((prev) => [...prev, itemToDelete]);
    setShowModal(false);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowModal(false);
  };

  // Final save function to send deleted items to the backend
  const handleFinalSave = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/museums/saveDeletedItems/`, // Your backend endpoint to save deleted items
        { deletedItems } // Send deletedItems in the request body
      );
      console.log("Deleted items saved successfully:", response.data);
      // You may want to reset the deletedItems state or give feedback to the user
      setDeletedItems([]);
    } catch (error) {
      console.error("Error saving deleted items:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">
        Delete Ticket Availability
      </h2>
      <Form.Group controlId="monthSelect">
        <Form.Label>Select Month</Form.Label>
        <Form.Control
          as="select"
          value={month}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mb-4"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={String(index + 1).padStart(2, "0")}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Render availability cards */}
      <div className="availability-cards">
        {availabilityData.map(({ date, shifts }) => (
          <Card key={date} className="mb-3">
            <Card.Body>
              <Card.Title>{new Date(date).toDateString()}</Card.Title>
              {shifts.map(({ shift_type }) => {
                const dayShift = `${date}-${shift_type}`;
                return (
                  <div
                    key={dayShift}
                    className="shift-card"
                    onClick={() => handleDelete(dayShift)}
                  >
                    <Card.Text>
                      Shift: <strong>{shift_type}</strong>
                    </Card.Text>
                    <Button
                      variant={
                        deletedItems.includes(dayShift) ? "danger" : "primary"
                      }
                    >
                      {deletedItems.includes(dayShift) ? "Deleted" : "Delete"}
                    </Button>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the following item?
          <br />
          <strong>{itemToDelete}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Final Save Button */}
      <Button
        variant="success"
        onClick={handleFinalSave}
        disabled={deletedItems.length === 0} // Disable if no items to delete
        className="mt-4"
      >
        Final Save Deleted Items
      </Button>
    </div>
  );
};

export default AvailabilityManager;
