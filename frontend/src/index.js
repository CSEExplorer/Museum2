import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";
import { RoleProvider } from "./contexts/RoleProvider.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

// Django's CSRF header name

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RoleProvider>
      <App />
    </RoleProvider>
  </StrictMode>
);
