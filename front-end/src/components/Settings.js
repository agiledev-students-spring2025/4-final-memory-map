import React, { useState } from "react";
import ProfileNav from "./ProfileNav";
import Help from "./Help";

const Settings = ({ setCurrComponent, setUser, user }) => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("English");

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
                {/* Notifications Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Notifications</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Enable Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications}
                                onChange={() => setNotifications(!notifications)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Appearance</h3>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Dark Mode</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Language</span>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                </div>

                {/* Help & About Section */}
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
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-600">About</span>
                        <p className="text-sm text-gray-500 mt-1">Version: 0.1.0</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8 space-x-4">
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Save Changes
                </button>
                <button 
                    onClick={() => setCurrComponent(<ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} user={user} />)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Settings;
