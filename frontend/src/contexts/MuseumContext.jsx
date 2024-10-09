import React, { createContext, useState, useContext } from 'react';

const MuseumContext = createContext();

export const MuseumProvider = ({ children }) => {
    const [museumData, setMuseumData] = useState(null);

    const saveMuseumData = (data) => {
        setMuseumData(data);
    };

    return (
        <MuseumContext.Provider value={{ museumData, setMuseumData }}>
            {children}
        </MuseumContext.Provider>
    );
};

// Custom hook to use the Museum Context
export const useMuseum = () => {
    return useContext(MuseumContext);
};
