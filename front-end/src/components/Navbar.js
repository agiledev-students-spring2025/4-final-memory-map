import React from 'react';
import NavbarTab from './NavbarTab';

const Navbar = () => {
    return (
        <nav>
            <ul className="flex justify-between">
                <li>
                    <NavbarTab to="/landing" label="Landing" />
                </li>
                <li>
                    <NavbarTab to="/friends" label="Friends" />
                </li>
                <li>
                    <NavbarTab to="/feeds" label="Feed" />
                </li>
                <li>
                    <NavbarTab to="/profile" label="Profile" />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
