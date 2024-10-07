









//NO need of this Context as i have done this thing using local state with callback ehich is only for the
//  particualr header and profile.jsx



import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profile_image: '',
        // other fields as necessary
    });

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);
