import React from "react";
import ProfileNav from "./ProfileNav";

const Settings = ({ setCurrComponent }) => {
    return (
        <div className="w-5/6 mx-auto bg-white mt-20 p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Settings</h2>
            
            <div className="space-y-4">

                <label className="block">
                    <span className="text-gray-700">Dark Mode</span>
                    <input type="checkbox" className="ml-2" />
                </label>

                <label className="block">
                    <span className="text-gray-700">Privacy</span>
                    <input type="checkbox" className="ml-2" />
                </label>
            </div>

            <div className="flex justify-center mt-6">
                <button 
                    onClick={() => setCurrComponent(<ProfileNav setCurrComponent={setCurrComponent} />)}
                    className="px-4 py-2 bg-gray-500 text-white hover:bg-green-600 transition"
                >
                    Save & Back
                </button>
            </div>
        </div>
    );
};

export default Settings;
