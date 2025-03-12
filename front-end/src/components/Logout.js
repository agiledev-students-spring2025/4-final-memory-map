import React from "react";
import ProfileNav from "./ProfileNav"; 
import { useNavigate } from "react-router-dom";

const Logout = ({ setCurrComponent, setUser }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser({ first_name: "First", last_name: "Last", username: "unknown" });
        navigate("../login");
    }

    return (
        <div className="w-5/6 mx-auto bg-white mt-20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-center mb-4">Do you want to sign out?</h2>
            <div className="flex justify-center space-x-4 mt-4">
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white transition hover:bg-red-600"
                >
                    Logout
                </button>
                <button 
                    onClick={() => setCurrComponent(() => <ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} />)}
                    className="px-4 py-2 bg-gray-300 text-black transition hover:bg-gray-400 "
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Logout;

