import React from "react";
import { Link } from "react-router-dom";

const ProfileNav = ()=>{
    return (
        <div className="w-5/6 mx-auto bg-white mt-20 rounded-lg">
            <Link
            to="#"
            className="flex items-center justify-between p-4 border-b text-gray-800 hover:bg-gray-100 transition"
            >
                <span>Edit</span>
            </Link>

            <Link
            to="#"
            className="flex items-center justify-between p-4 border-b text-gray-800 hover:bg-gray-100 transition"
            >
                <span>Settings</span>
            </Link>

            <Link
            to="#"
            className="flex items-center justify-between p-4 border-b text-gray-800 hover:bg-gray-100 transition"
            >
                <span>Logout</span>
            </Link>
        </div>
    );
};

export default ProfileNav;