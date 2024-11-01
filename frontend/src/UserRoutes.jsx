// src/routes/UserRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Cart from "./Component/User/Cart";
import Advertisement from "./Component/User/Advertisement";
import Review from "./Component/User/Review";
import Information from "./Component/User/Information";
import Login from "./Component/User/Login";
import Signup from "./Component/User/Signup";
import Help from "./Component/User/Help";
import History from "./Component/User/History";
import ProfileAccount from "./Component/User/ProfileAccount";
// import Tickets from "../Component/User/Tickets";
import Explore from "./Component/User/Explore";
import Places from "./Component/User/Place";
import Booking from "./Component/User/Booking";
import ShowAvailability from "./Component/User/ShowAvailability";
import ForgetPassword from "./Component/User/ForgetPassword";
import ResetPassword from "./Component/User/ResetPassword";
// import AddAvailability from "../Component/Museum/AddAvailabilities";
import Tickets from "./Component/User/Tickets";
import SearchBar from "./Component/User/Searchbar";
import LoginWithOTP from "./Component/User/LoginWithOtp";
const UserRoutes = ({ setMuseumDetails, setProfile, museumDetails}) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <>
            <Cart />
            <Advertisement />
            <Review />
          </>
        }
      />
      <Route path="/information" element={<Information />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/places"
        element={<Places setMuseumDetails={setMuseumDetails} />}
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/help" element={<Help />} />
      <Route
        path="/booking/:museumId"
        element={<Booking museumDetails={museumDetails} />}
      />
      <Route path="/history" element={<History />} />
      <Route
        path="/profile"
        element={<ProfileAccount setProfile={setProfile} />}
      />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/explore" element={<Explore />} />
      {/* <Route path="/availabilities" element={<AddAvailability />} /> */}
      <Route path="/availability/:museumId" element={<ShowAvailability />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/searchbar" element={<SearchBar />} />
      <Route path="/login-with-otp" element={<LoginWithOTP />} />
    </Routes>
  );
};

export default UserRoutes;
