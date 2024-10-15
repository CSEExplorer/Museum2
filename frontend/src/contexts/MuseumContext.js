import React, { createContext, useState, useContext } from 'react';

const MuseumContext = createContext();

export const MuseumProvider = ({ children }) => {
    const [museumData, setMuseumData] = useState(null);

    const saveMuseumData = (data) => {
        setMuseumData(data);
    };
    const updateAvailability = (newAvailability) => {
        setMuseumData((prevData) => ({
            ...prevData,
            availability: newAvailability,
        }));
    };

    return (
        <MuseumContext.Provider value={{ museumData, setMuseumData,updateAvailability}}>
            {children}
        </MuseumContext.Provider>
    );
};

// Custom hook to use the Museum Context
export const useMuseum = () => {
    return useContext(MuseumContext);
};
