import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated import for v6

const SearchBar = () => {
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!window.google) {
      console.error("Google API failed to load");
      return;
    }
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"],
        componentRestrictions: { country: "IN" },
      }
    );

    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace();
      console.log(place);
      if (place && place.name) {
        const city = place.name;
        navigate(`/places?city=${city}`);
      }
    };

    autocomplete.addListener("place_changed", handlePlaceChanged);

    return () => {
      // Simply clear the input field when unmounting
      autocomplete.unbindAll();
    };
  }, [navigate]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    
  };

  return (
    <form
      className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
      role="search"
      onSubmit={handleSearchSubmit}
    >
      <input
        type="search"
        className="form-control form-control-dark text-bg-light"
        placeholder="Search for a city"
        aria-label="Search"
        ref={inputRef}
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </form>
  );
};

export default SearchBar;
