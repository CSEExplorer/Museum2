import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState('');

    const changeRole = (newRole) => {
        setRole(newRole);
        localStorage.setItem('role', newRole); // Optionally store the role in local storage
    };

    return (
        <RoleContext.Provider value={{ role, changeRole }}>
            {children}
        </RoleContext.Provider>
    );
};
