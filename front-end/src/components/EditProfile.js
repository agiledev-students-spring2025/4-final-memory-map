import React, { useState } from "react";
import ProfileNav from "./ProfileNav";

const EditProfile = ({ setCurrComponent, user, setUser }) => {
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");

    const handleSave = () => {

        setUser(prevUser => ({
            ...prevUser,
            first_name: firstName,
            last_name: lastName
        }));

      
        setCurrComponent(<ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} user={{ first_name: firstName, last_name: lastName }} />);
    };

    return (
        <div className="w-5/6 mx-auto bg-white mt-20 p-6">
            <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-center mt-4">
                <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-gray-500 text-white hover:bg-green-600 transition"
                >
                    Save and Back
                </button>
            </div>
        </div>
    );
};

export default EditProfile;

