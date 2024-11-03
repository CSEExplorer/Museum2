import React, { useState ,useEffect} from "react";
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
import Footer from "./Component/User/Footer";
// import Chatboard from "./Component/User/Chatboard";
import { MuseumProvider } from "./contexts/MuseumContext";
import UserRoutes from "./UserRoutes";
import MuseumRoutes from "./MuseumRoutes";
import MuseumHeader from "./Component/Museum/MuseumHeader";
import Header from "./Component/User/Header";
import { useRole } from "./contexts/RoleProvider"; // Import useRole
import LoginMuseum from "./Component/Museum/LoginMuseum";
import SignupMuseum from "./Component/Museum/SignupMuseum";
import ChatBot from "./Component/User/ChatBot"
import AuthProvider from "./contexts/AuthContext";
function App() {
 
  
  const [profile, setProfile] = useState({
    profile_image: "",
    username: "",
    email: "",
  });


  const [uniqueId, setUniqueId] = useState(null);
  const [museumDetails, setMuseumDetails] = useState({
    fare: 1,
    id: "",
    name: "",
  });



  const { role = "user" } = useRole(); // Fetch role from context

  return (
    <Router>
      <AuthProvider>
        {role === "admin" ? <MuseumHeader /> : <Header />}

        <MuseumProvider>
          <Routes>
            <Route
              path="/museum-login"
              element={
                <LoginMuseum uniqueId={uniqueId} setUniqueId={setUniqueId} />
              }
            />

            <Route path="/museum-signup" element={<SignupMuseum />} />

            {role === "admin" ? (
              <Route path="/*" element={<MuseumRoutes />} />
            ) : (
              <Route
                path="/*"
                element={
                  <UserRoutes
                    setMuseumDetails={setMuseumDetails}
                    museumDetails={museumDetails}
                    setProfile={setProfile}
                  />
                }
              />
            )}
          </Routes>
        </MuseumProvider>

       { role=="user" && <ChatBot />}

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
