import React from 'react';
import { Link } from 'react-router-dom';

const NavbarTab = ({ to, label }) => {
    return (
        <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14">
            {label}
        </Link>
    );
};

export default NavbarTab;