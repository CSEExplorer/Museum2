// src/routes/MuseumRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import MuseumDashboard from "./Component/Museum/MuseumDashboard";
import MuseumLogout from "./Component/Museum/MuseumLogout";
import MuseumHeader from "./Component/Museum/MuseumHeader";
import AddAvailability from "./Component/Museum/AddAvailabilities";
import UpdateAvailablity from "./Component/Museum/UpdateAvailaiblity";
import DeleteAvailability from "./Component/Museum/DeleteAvailability"
const MuseumRoutes = ({ uniqueId}) => {
  return (
    <Routes>
      <Route
        path="/museum-dashboard"
        element={<MuseumDashboard uniqueId={uniqueId} />}
      />
      <Route path="/museum-logout" element={<MuseumLogout />} />
      <Route path="/musuem-header" element={<MuseumHeader />} />
      <Route path="/Addavailabilities" element={ <AddAvailability/>} />
      <Route path="/Updateavailabilities" element={<UpdateAvailablity />} />
      <Route path="/Deleteavailabilities" element={<DeleteAvailability />} />
    </Routes>
  );
};

export default MuseumRoutes;
