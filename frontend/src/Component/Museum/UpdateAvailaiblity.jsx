import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap";
import "../../Css/Museum/UpdateAvailability.css";
const apiUrl = process.env.REACT_APP_API_URL;

const Availability = () => {
  const uniqueId = localStorage.getItem("uniqueId");
  const [month, setMonth] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [selectedChanges, setSelectedChanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updatedTickets, setUpdatedTickets] = useState({});
  const [initialTickets, setInitialTickets] = useState({});
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    if (month) {
      fetchAvailability(month);
    }
  }, [month]);

  const fetchAvailability = async (month) => {
    try {
      const response = await axios.get(`${apiUrl}/museums/giveavailablity/`, {
        params: { month: month, id: uniqueId },
      });
      setAvailabilityData(response.data);

      const initialValues = {};
      response.data.forEach(({ date, shifts }) => {
        shifts.forEach(({ shift_type, tickets_available }) => {
          initialValues[`${date}-${shift_type}`] = tickets_available;
        });
      });
      setInitialTickets(initialValues);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };
  // i have made the key of date-shift_type

  const handleUpdate = (date, shift_type) => {
    const currentAvailable =
      updatedTickets[`${date}-${shift_type}`] !== undefined
        ? updatedTickets[`${date}-${shift_type}`]
        : initialTickets[`${date}-${shift_type}`];

    setSelectedChanges((prevChanges) => {
      const existingChangeIndex = prevChanges.findIndex(
        (change) => change.date === date && change.shift_type === shift_type
      );

      if (existingChangeIndex >= 0) {
        let updatedChanges = [];

        for (let i = 0; i < prevChanges.length; i++) {
          const change = prevChanges[i];

          // Check if current item is the one to update
          if (i === existingChangeIndex) {
            updatedChanges.push({
              ...change, // Spread existing properties of the found item
              ticketsAvailable: currentAvailable, // Update the `ticketsAvailable` property
            });
          } else {
            updatedChanges.push(change); // Add unchanged items
          }
        }
        return updatedChanges;
      } else {
        return [
          ...prevChanges,
          {
            action: "update",
            date,
            shift_type,
            ticketsAvailable: currentAvailable,
          },
        ];
      }
    });
  };

  const handleSaveChanges = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    console.log(selectedChanges);
    setShowModal(false);
    setSelectedChanges([]);
  };

  const handleTicketChange = (date, shift_type, value) => {
    setUpdatedTickets((prev) => ({
      ...prev,
      [`${date}-${shift_type}`]: value,
    }));
  };

  const toggleEditMode = (date, shift_type) => {
    setEditMode((prev) => ({
      ...prev,
      [`${date}-${shift_type}`]: !prev[`${date}-${shift_type}`],
    }));
  };

  const renderUpdateField = (date, shift_type) => {
    const currentTicketsAvailable =
      updatedTickets[`${date}-${shift_type}`] !== undefined
        ? updatedTickets[`${date}-${shift_type}`]
        : initialTickets[`${date}-${shift_type}`];

    return (
      <div>
        <Card.Text>
          Initial Tickets Available:{" "}
          <strong>{initialTickets[`${date}-${shift_type}`] || "N/A"}</strong>
        </Card.Text>
       {editMode[`${date}-${shift_type}`] ? (
          <Form.Control
            type="number"
            value={currentTicketsAvailable}
            onChange={(e) =>
              handleTicketChange(date, shift_type, e.target.value)
            }
            placeholder="Update Tickets Available"
            className="mb-2"
          />
        ) : (
          <Card.Text className="text-muted">
            Current Available: <strong>{currentTicketsAvailable}</strong>
          </Card.Text>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">
        Update Ticket Availability
      </h2>
      <Form.Group controlId="monthSelect">
        <Form.Label>Select Month</Form.Label>
        <Form.Control
          as="select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
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

      <Row>
        {availabilityData.map(({ date, shifts }) => (
          <Col md={12} key={date} className="mb-3">
            <Card className="shadow-sm rounded">
              <Card.Body>
                <Card.Title className="text-info">
                  {new Date(date).toDateString()}
                </Card.Title>
                {shifts.map(({ shift_type, tickets_available, id }) => (
                  <div key={`${date}-${shift_type}`} className="mb-3">
                    <Card.Text>
                      Shift: <strong>{shift_type}</strong>
                    </Card.Text>
                    {renderUpdateField(date, shift_type)}
                    <Button
                      variant={
                        editMode[`${date}-${shift_type}`]
                          ? "success"
                          : "primary"
                      }
                      onClick={() => {
                        if (editMode[`${date}-${shift_type}`]) {
                          handleUpdate(date, shift_type); // Call update if in edit mode
                        }
                        toggleEditMode(date, shift_type); // Toggle edit mode
                      }}
                    >
                      {editMode[`${date}-${shift_type}`] ? "Save" : "Edit"}
                    </Button>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Button variant="success" onClick={handleSaveChanges} className="mt-3">
        Save All Changes
      </Button>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {selectedChanges.map((change, index) => (
              <li key={index}>
                Update - {change.date}, Shift: {change.shift_type}, New Tickets
                Available: {change.ticketsAvailable}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Availability;
