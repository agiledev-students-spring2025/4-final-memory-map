import React from "react";
import Settings from "./Settings";

const Help = ({ setCurrComponent, user, setUser }) => {
    return (
        <div className="w-5/6 mx-auto bg-white p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Settings</h2>
            
            <p className="p-4 border w-full text-gray-800">
                Need assistance? 
            </p>

            <p className="text-gray-700 mt-5 bg-gray">
                Email us at <strong>memmap@gmail.com</strong>
            </p>

            <div className="flex justify-center mt-6">
                <button 
                    onClick={() => setCurrComponent(<Settings setCurrComponent={setCurrComponent} user={user} setUser={setUser} />)}
                    className="px-4 py-2 bg-gray-500 text-white hover:bg-blue-600 transition"
                >
                    Back to Settings
                </button>
            </div>
        </div>
    );
};

export default Help;