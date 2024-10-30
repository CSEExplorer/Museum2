import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMuseum } from "../../contexts/MuseumContext";
const apiUrl = process.env.REACT_APP_API_URL;

const MuseumDashboard = () => {
  const uniqueId=localStorage.getItem("uniqueId");
  const { museumData, setMuseumData } = useMuseum();
  useEffect(() => {
    fetchMuseumDetails();
  }, []);

  const fetchMuseumDetails = async () => {
    try {
      const response = await axios.post(`${apiUrl}/museums/museum-details/`, {
        uniqueId,
      });
      setMuseumData(response.data);
    } catch (error) {
      console.error("Error fetching museum details:", error);
    }
  };

  if (!museumData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5" style={styles.container}>
      <h1 className="text-center mb-4">
        Welcome to {museumData.name}'s Dashboard
      </h1>
      <div className="row">
        {/* Museum details */}
        <div className="col-md-12 mb-4">
          <div className="card" style={styles.card}>
            <div className="card-body">
              <h5>Museum Information</h5>
              <p>
                <strong>Name:</strong> {museumData.name}
              </p>
              <p>
                <strong>Address:</strong> {museumData.address}
              </p>
              <p>
                <strong>City:</strong> {museumData.city}
              </p>
              <p>
                <strong>Email:</strong> {museumData.email}
              </p>
              <p>
                <strong>Contact Number:</strong> {museumData.contact_number}
              </p>
              <p>
                <strong>Fare:</strong> {museumData.fare}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(museumData.created_at).toLocaleDateString()}
              </p>
              <Link to="/update-details" className="btn btn-primary">
                Update Museum Info
              </Link>
            </div>
          </div>
        </div>

        {/* Number of availabilities */}
        <div className="col-md-12 mb-4">
          <div className="card" style={styles.card}>
            <div className="card-body">
              <h5> Availabilities</h5>
              <p>
                <strong>Total Number of Availabilities:</strong>{" "}
                {museumData.availabilities.length}
              </p>
              <Link to="/Addavailabilities" className="btn btn-info">
                Add Availabilities
              </Link>
            </div>
          </div>
        </div>
        {/*  save new Avilablity  */}

        <div className="col-md-12 mb-4">
          <div className="card" style={styles.card}>
            <div className="card-body">
              <h5>Availabilities</h5>
              <p>
                <strong>Total Number of Availabilities:</strong>
                {museumData.availabilities.length}
              </p>
              <Link to="/Updateavailabilities" className="btn btn-info">
                Update Availabilities
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <div className="card" style={styles.card}>
            <div className="card-body">
              <h5>Availabilities</h5>
              <p>
                <strong>Total Number of Availabilities:</strong>{" "}
                {museumData.availabilities.length}
              </p>
              <Link to="/Deleteavailabilities" className="btn btn-info">
                Delete Availabilities
              </Link>
            </div>
          </div>
        </div>

        {/* Other sections */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card" style={styles.card}>
              <div className="card-body">
                <h5>Manage Offers</h5>
                <Link to="/offers" className="btn btn-primary">
                  Go to Update
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card" style={styles.card}>
              <div className="card-body">
                <h5>Change Ticket Price</h5>
                <Link to="/ticket-price" className="btn btn-primary">
                  Go to Update
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card" style={styles.card}>
              <div className="card-body">
                <h5>Organize Events</h5>
                <Link to="/events" className="btn btn-primary">
                  Go to Update
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  shiftCard: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
};

export default MuseumDashboard;
