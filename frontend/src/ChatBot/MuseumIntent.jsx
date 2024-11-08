import React from "react";

// MuseumIntent component
const MuseumIntent = ({ museums,onBookClick }) => {
// console.log(museums);
  return (
    <div style={styles.museumContainer}>
      <h2 style={styles.museumTitle}>Museums Available:</h2>
      {museums.length > 0 ? (
        <ul style={styles.museumList}>
          {museums.map((museum, index) => (
            <li key={index} style={styles.museumItem}>
              <strong>{museum.name}</strong>
              <br />
              Fare: {museum.fare} Rupees
              <br />
              <button
                style={styles.exploreButton}
                onClick={() => handleExploreClick(museum.museum_id)} // Handle the explore action
              >
                Explore
              </button>
              <button
                style={styles.Book}
                onClick={() => onBookClick(museum)} // Handle the explore action
              >
                Book Now !
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No museums found in this city.</p>
      )}
    </div>
  );
};


const handleExploreClick = (museumId) => {
  
  console.log(`Explore museum with ID: ${museumId}`);// This can be replaced with a navigation function or a modal to show details
};


const styles = {
  museumContainer: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  museumTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
  },
  museumList: {
    listStyleType: "none",
    padding: "0",
  },
  museumItem: {
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  exploreButton: {
    marginTop: "5px",
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  Book: {
    marginTop: "5px",
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MuseumIntent;
