import React, { useState } from "react";
import ProfileNav from "./ProfileNav";

const EditProfile = ({ setCurrComponent, user, setUser }) => {
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");

    const handleSave = () => {
        if (!setUser) {
            console.error("Cannot update user.");
            return;
        }

        setUser(prevUser => ({
            ...prevUser,
            first_name: firstName,
            last_name: lastName
        }));

        
        setCurrComponent(
            <ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} user={{ first_name: firstName, last_name: lastName }} />
        );
    };

    return (
        <div className="w-5/6 mx-auto bg-white p-6">
            <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="flex justify-center mt-4">
            <button 
                    onClick={handleSave}
                    className={`px-4 py-2 text-white transition ${
                        firstName && lastName ? "bg-gray-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!firstName || !lastName} 
                >
                    Save and Back
                </button>
            </div>
        </div>
    );
};

export default EditProfile;

