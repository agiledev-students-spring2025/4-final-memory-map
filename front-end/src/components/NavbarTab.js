import React from 'react';
import { Link } from 'react-router-dom';

const NavbarTab = ({ to, label }) => {
    return (
        <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center" style={{ height: '60px', width: '60px' }}>
            {label}
        </Link>
    );
};

export default NavbarTab;