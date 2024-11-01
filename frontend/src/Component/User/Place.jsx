import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate ,useLocation} from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;
const mediaUrl = process.env.REACT_APP_MEDIA_URL;
const Places = ( {setMuseumDetails} ) => {

const [museums, setMuseums] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
// const [searchParams, setSearchParams] = useSearchParams();
// const [city, setCity] = useState(searchParams.get('city') || '');
const navigate = useNavigate();
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const city = searchParams.get("city");

  useEffect(() => {
    
    const fetchMuseums = async () => {
      if (!city) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/museums/city/?city=${city}`);
        console.log('this->',response.data);
        
        setMuseums(response.data);


        
      } catch (err) {
        setError('Failed to fetch museums. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMuseums();
  }, [location]);


 
 const handleBookTicket = (museum) => {
  console.log('Selected Museum:', museum);
  setMuseumDetails({
     fare : museum.fare,
     id :museum.museum_id,
     name :museum.name
  })
  // console.log(setMuseumDetails);
    navigate(`/availability/${museum.museum_id}`);
};

  return (
    <div className="container">
      <h1 className="mt-4">Museums in {city || '..'}</h1>



      {loading && <p>Loading museums...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !museums.length && city && (
        <p>No museums found for this city.</p>
      )}

      <div className="row">
        {museums.map((museum) => (
          <div key={museum.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                // console.log(museum.image)
                src={`${mediaUrl}${museum.image}`}
                className="card-img-top"
                alt={museum.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{museum.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong> {museum.address} <br />
                  <strong>Fare:</strong> ${museum.fare} <br />
                  <strong>Details:</strong> {museum.other_details}
                </p>
                <button className="btn btn-success" onClick={() => handleBookTicket(museum)}>
                  Book Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;
