import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Component/Header';
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

import ProfileAccount from './Buttons/ProfileAccount';
import Tickets from './Buttons/Tickets';
import Explore from './Buttons/Explore'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<><Cart /><Advertisement /><Review /></>} />
        <Route path="/information" element={<Information />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/help" element={<Help />} />
        <Route path="/history" element={<History />} />
      
        <Route path="/profile" element={<ProfileAccount />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/explore" element={<Explore />} />  {/* New route for Explore */}
      </Routes>
      <Chatboard />
     
      <Footer />
    </Router>
  );
}

export default App;
