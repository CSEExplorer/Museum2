// HeaderSelector.jsx
import React, { useContext } from 'react';
import { RoleContext } from '../contexts/RoleProvider';

import MuseumHeader from './MuseumHeader';
import UserHeader from './Header';

const HeaderSelector = () => {
    const { role } = useContext(RoleContext);

    // Conditionally render headers based on the role
    return role === 'admin' ? <MuseumHeader /> : <UserHeader />;
};

export default HeaderSelector;
