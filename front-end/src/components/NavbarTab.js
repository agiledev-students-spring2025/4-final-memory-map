import React from 'react';
import { Link } from 'react-router-dom';
import PinIcon from './icons/PinIcon';
import FeedIcon from './icons/FeedIcon';
import FriendsIcon from './icons/FriendsIcon';
import ProfileIcon from './icons/ProfileIcon';
import PlusIcon from './icons/PlusIcon';

const NavbarTab = ({ to, label, notificationCount }) => {
    const baseClassName = "bg-gray-400 text-white hover:bg-gray-700 flex items-center justify-center h-14 w-14 relative";
    
    const renderIcon = () => {
        switch (label) {
            case "Landing":
                return <PinIcon>{label}</PinIcon>;
            case "Friends":
                return <FriendsIcon>{label}</FriendsIcon>;
            case "New Location":
                return <PlusIcon>{label}</PlusIcon>;
            case "Feed":
                return <FeedIcon>{label}</FeedIcon>;
            default:
                return <ProfileIcon>{label}</ProfileIcon>;
        }
    };
    
    return (
        <Link to={to} className={baseClassName}>
            {renderIcon()}
            
            {notificationCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {notificationCount > 9 ? '9+' : notificationCount}
                </span>
            )}
        </Link>
    );
};

export default NavbarTab;