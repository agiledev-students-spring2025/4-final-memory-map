import React from "react";
import ProfileNav from "./ProfileNav";
import Help from "./Help";

const Settings = ({ setCurrComponent, setUser, user }) => {

    const handleSave = () => {
        if (!setUser) {
            console.error("Unable to save settings");
            return;
        }
    
        setCurrComponent(<ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} />);
    };
    
    return (
        <div className="w-5/6 mx-auto bg-white p-6">
            <h2 className="text-xl font-semibold text-center">Settings</h2>
            
            <div className="space-y-4">
                <label className="block">
                    <button 
                        onClick={() => setCurrComponent(<Help setCurrComponent={setCurrComponent} setUser={setUser} />)}
                        className="p-4 border-b w-full text-gray-800 hover:bg-gray-100 transition text-left"
                    >
                        Help
                    </button>
                </label>

                <label className="block">
                    <span className="text-gray-700">About</span>
                    <p className="font-light text-xs">Version: 0.1.0</p>
                </label>
            </div>

            <div className="flex justify-center mt-6">
                <button 
                   onClick={handleSave} 
                    className="px-4 py-2 bg-gray-500 text-white hover:bg-green-600 transition"
                >
                    Save & Back
                </button>
            </div>
        </div>
    );
};

export default Settings;
