// RoleProvider.js
import React, { createContext, useContext, useState,useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

    useEffect(() => {
      localStorage.setItem("role", role);
    }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
