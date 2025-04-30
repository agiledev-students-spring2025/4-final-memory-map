import React from "react";
import ProfileNav from "./ProfileNav";
import Help from "./Help";

const Settings = ({ setCurrComponent, setUser, user }) => {
    const handleSave = () => {
        if (!setUser) {
            console.error("Unable to save settings");
            return;
        }
        setCurrComponent(<ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} user={user} />);
    };

    return (
        <div className="w-5/6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Settings</h2>
            
            <div className="space-y-6">

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Support</h3>
                    <button 
                        onClick={() => setCurrComponent(<Help setCurrComponent={setCurrComponent} setUser={setUser} user={user} />)}
                        className="w-full p-3 text-left text-gray-700 hover:bg-gray-100 rounded-md transition flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help Center
                    </button>
                </div>

              
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">About</h3>
                    <div className="space-y-2">
                        <p className="text-gray-600">Version: 0.1.0</p>
                        <p className="text-sm text-gray-500">Memory Map - A place to store and organize your memories</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Back to Profile
                </button>
            </div>
        </div>
    );
};

export default Settings;
