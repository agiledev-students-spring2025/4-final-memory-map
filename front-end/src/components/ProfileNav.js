import React from "react";
import EditProfile from '../components/EditProfile';
import Settings from '../components/Settings';
import Logout from '../components/Logout';

const ProfileNav = ({ setCurrComponent, user, setUser }) => {
    return (
        <div className="max-w-md mx-auto bg-white mt-20 rounded-lg">
            {/* Edit Profile */}
            <button
                onClick={() => setCurrComponent(<EditProfile setCurrComponent={setCurrComponent} user={user} setUser={setUser} />)}
                className="p-4 border-b w-full text-gray-800 hover:bg-gray-100 transition text-left"
            >
                <span>Edit</span>
            </button>

            {/* Settings */}
            <button
                onClick={() => setCurrComponent(<Settings setCurrComponent={setCurrComponent} />)}
                className="p-4 border-b w-full text-gray-800 hover:bg-gray-100 transition text-left"
            >
                <span>Settings</span>
            </button>

            {/* Logout */}
            <button
                onClick={() => setCurrComponent(<Logout setCurrComponent={setCurrComponent} setUser={setUser}/>)}
                className="p-4 border-b w-full text-gray-800 hover:bg-gray-100 transition text-left"
            >
                <span>Logout</span>
            </button>
        </div>
    );
};

export default ProfileNav;
