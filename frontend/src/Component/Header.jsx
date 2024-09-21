import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import profile icon
import Logo from '../Buttons/Logo.jpg'; // Corrected path and extension
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL; 
const BASE_URL = 'https://museum-rr68.onrender.com';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  useEffect(() => {
    // Fetch profile image from backend if user is logged in
    const fetchProfileImage = async () => {
      const token = localStorage.getItem('token'); // Adjust token storage based on your auth logic
      if (token) {
        try {
          const response = await axios.get(`${apiUrl}/profile/`, {
            headers: { Authorization: `Token ${token}` },
          });
          setProfileImage(`${BASE_URL}${response.data.profile_image}`); // Update with your actual API structure
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };

    fetchProfileImage();
  }, []);

  useEffect(() => {
    // Close dropdown if clicked outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/places?city=${searchQuery}`);
    }
  };

  const handleLogout = async () => {
    // Confirm logout with the user
    const confirmed = window.confirm('Are you sure you want to log out?');

    if (!confirmed) {
      return; // Do nothing if the user cancels
    }

    try {
      const token = localStorage.getItem('token');

      // Check if token exists
      if (!token) {
        console.warn('No token found. User might not be logged in.');
        navigate('/login');
        return;
      }

      // Make the logout request
      await axios.post(`${apiUrl}/logout/`, null, {
        headers: {
          Authorization: `Token ${token}`,  // Get token from local storage
        },
      });

      // Remove the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      // Log detailed error
      console.error('Logout failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link
            to="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
            style={{ textDecoration: 'none' }}
          >
            <img src={Logo} alt="Museum Logo" style={{ width: '40px', height: '32px', marginRight: '8px', borderRadius: '45%' }} />
            <span className="fs-4 text-white"></span>
          </Link>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/places" className="nav-link px-2 text-white">Places</Link></li>
            <li><Link to="/tickets" className="nav-link px-2 text-white">Tickets</Link></li>
            <li><Link to="/explore" className="nav-link px-2 text-white">Explore</Link></li>
            <li><Link to="/help" className="nav-link px-2 text-white">Help</Link></li>
          </ul>

          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="form-control form-control-dark text-bg-dark"
              placeholder="Search City"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>

          <div className="text-end d-flex align-items-center">
            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link to="/signup" className="btn btn-warning">Sign-up</Link>

            {/* Profile Icon and Dropdown */}
            <div className="dropdown ms-3" ref={dropdownRef}>
              <button
                className="btn btn-outline-light d-flex align-items-center"
                onClick={toggleDropdown}
                style={{ padding: '0', borderRadius: '50%', overflow: 'hidden', width: '40px', height: '40px' }} // Ensures circular container
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Circular and responsive image
                  />
                ) : (
                  <FaUserCircle size={30} color="white" />
                )}
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/history">History</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Sign Out</button></li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
