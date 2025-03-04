import React, { useState, useEffect, useRef,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../../Media/User/Logo.jpg";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
import SearchBar from "./Searchbar";
import { AuthContext } from "../../contexts/AuthContext";

const Header = () => {
  const { logout ,isAuthenticated} = useContext(AuthContext);
  const [profile, setProfile] = useState(
    localStorage.getItem("profile_image_url")
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const loginDropdownRef = useRef(null); // Ref for login dropdown
  const signupDropdownRef = useRef(null); // Ref for signup dropdown

 


  useEffect(() => {
    // Close dropdowns if clicked outside of them
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target)
      ) {
        setLoginDropdownOpen(false);
      }
      if (
        signupDropdownRef.current &&
        !signupDropdownRef.current.contains(event.target)
      ) {
        setSignupDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleLoginDropdown = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
  };

  const toggleSignupDropdown = () => {
    setSignupDropdownOpen(!signupDropdownOpen);
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
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) {
      return; // Do nothing if the user cancels
    }

    try {
      const token = localStorage.getItem("token");

      // Check if token exists
      if (!token) {
        console.warn("No token found. User might not be logged in.");
        navigate("/login");
        return;
      }

      // Make the logout request
      await axios.post(`${apiUrl}/logout/`, null, {
        headers: {
          Authorization: `Token ${token}`, // Get token from local storage
        },
      });
      logout();
      navigate("/login");
    } catch (error) {
      // Log detailed error
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link
            to="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
            style={{ textDecoration: "none" }}
          >
            <img
              src={Logo}
              alt="Museum Logo"
              style={{
                width: "40px",
                height: "32px",
                marginRight: "8px",
                borderRadius: "45%",
              }}
            />
            <span className="fs-4 text-white"></span>
          </Link>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/places" className="nav-link px-2 text-white">
                Places
              </Link>
            </li>
            <li>
              <Link to="/tickets" className="nav-link px-2 text-white">
                Tickets
              </Link>
            </li>
            <li>
              <Link to="/explore" className="nav-link px-2 text-white">
                Explore
              </Link>
            </li>
            <li>
              <Link to="/help" className="nav-link px-2 text-white">
                Help
              </Link>
            </li>
          </ul>

          <SearchBar />

          <div className="text-end d-flex align-items-center">
            {/* Login Dropdown */}
            <div className="dropdown me-2" ref={loginDropdownRef}>
              <button
                className="btn btn-outline-light dropdown-toggle"
                onClick={toggleLoginDropdown}
                type="button"
              >
                Login
              </button>
              {loginDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Login as User
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/museum-login">
                      Login as Museum
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Signup Dropdown */}
            <div className="dropdown me-2" ref={signupDropdownRef}>
              <button
                className="btn btn-warning dropdown-toggle"
                onClick={toggleSignupDropdown}
                type="button"
              >
                Sign-up
              </button>
              {signupDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <Link className="dropdown-item" to="/signup">
                      Signup as User
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/museum-signup">
                      Signup as Museum
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Profile Icon and Dropdown */}
            <div className="dropdown ms-3" ref={dropdownRef}>
              <button
                className="btn btn-outline-light d-flex align-items-center"
                onClick={toggleDropdown}
                style={{
                  padding: "0",
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: "40px",
                  height: "40px",
                }} // Ensures circular container
              >
                { isAuthenticated ? (
                  <img
                    src={profile}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }} // Circular and responsive image
                  />
                ) : (
                  <FaUserCircle size={40} color="white" />
                )}
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/history">
                      History
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Sign Out
                    </button>
                  </li>
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
