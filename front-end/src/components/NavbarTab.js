import React from 'react';
import { Link } from 'react-router-dom';
import PinIcon from './icons/PinIcon';
import FeedIcon from './icons/FeedIcon';
import FriendsIcon from './icons/FriendsIcon';
import ProfileIcon from './icons/ProfileIcon';
import PlusIcon from './icons/PlusIcon';


const NavbarTab = ({ to, label }) => {
    if (label === "Landing") {
        return (
            <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14">
                <PinIcon>
                    {label}
                </PinIcon>
            </Link>
        );
    } else if (label === "Friends") {
        return (
            <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14">
                <FriendsIcon>
                    {label}
                </FriendsIcon>
            </Link>
        );
    } else if (label === "New Location") {
        return (
            <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14">
                <PlusIcon>
                    {label}
                </PlusIcon>
            </Link>
        );
    } else if (label === "Feed") {
        return (
            <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14">
                <FeedIcon>
                    {label}
                </FeedIcon>
            </Link>
        );
    } else {
        return (
            <Link to={to} className="bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14">
                <ProfileIcon>
                    {label}
                </ProfileIcon>
            </Link>
        );
    }
};

export default NavbarTab;