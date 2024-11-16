import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";
import { RoleProvider } from "./contexts/RoleProvider.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Google Client ID (replace this with your actual Client ID)
const GOOGLE_CLIENT_ID =
  "726313925009-or8aaja8j19le3k45nklh49he6ineu1i.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RoleProvider>
        <App />
      </RoleProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
