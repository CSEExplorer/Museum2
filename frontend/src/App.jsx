import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderSelector from './Component/HeaderSelector'; // Import HeaderSelector
import Footer from './Component/Footer';
import Cart from './Component/Cart';
import Advertisement from './Component/Advertisement';
import Review from './Component/Review';
import Information from './Component/Information';
import Login from './Buttons/Login';
import Signup from './Buttons/Signup';
import Help from './Buttons/Help';
import Chatboard from './Component/Chatboard';
import History from './Buttons/History';
import Booking from './Buttons/Booking';
import ProfileAccount from './Buttons/ProfileAccount';
import Tickets from './Buttons/Tickets';
import Explore from './Buttons/Explore';
import SignupMuseum from './Component/SignupMuseum';
import LoginMuseum from './Component/LoginMuseum';
import MuseumDashboard from './Component/MuseumDashboard';
import Places from './Buttons/Place';
import MuseumLogout from './Component/MuseumLogout';
import { RoleProvider } from './contexts/RoleProvider';
// import { ProfileProvider } from './contexts/ProfileContext';

function App() {
   const [profile, setProfile] = useState({
        profile_image: '',
        username: '',
        email: '',
   });
   const [uniqueId, setUniqueId] = useState(null); 
  return (
    <RoleProvider>
     
      <Router>
        
        <HeaderSelector profile={profile}/> 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Cart /><Advertisement /><Review /></>} />
          <Route path="/information" element={<Information />} />
          <Route path="/login" element={<Login />}  />
          <Route path="/places" element={<Places />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/help" element={<Help />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<ProfileAccount  setProfile={setProfile} />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/explore" element={<Explore />} />

          {/* Museum Owner Routes */}
          <Route path="/museum-signup" element={<SignupMuseum />} />
          <Route path="/museum-login" element={<LoginMuseum uniqueId={ uniqueId } setUniqueId={ setUniqueId } />} />
          <Route path="/museum-dashboard" element={<MuseumDashboard   uniqueId={ uniqueId } />} />
          <Route path="/museum-logout" element={<MuseumLogout />} />
        </Routes>
        <Chatboard />
        <Footer />
        </Router>
        
    </RoleProvider>
  );
}

export default App;
