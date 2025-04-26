import React, { useState } from 'react';

const FeedFilters = ({ activeFilters, handleToggleFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="mb-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Filter Memories
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {activeFilters.length}
                    </span>
                </button>
            </div>
            
            {isOpen && (
                <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                            <input
                                type="checkbox"
                                checked={activeFilters.includes('own')}
                                onChange={() => handleToggleFilter('own')}
                                className="form-checkbox h-4 w-4 text-gray-700 rounded border-gray-300 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                                <span className="inline-block w-3 h-3 bg-gray-700 rounded-full mr-2"></span>
                                Your Memories
                            </span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                            <input
                                type="checkbox"
                                checked={activeFilters.includes('friend')}
                                onChange={() => handleToggleFilter('friend')}
                                className="form-checkbox h-4 w-4 text-indigo-500 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                                <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                                Friend Memories
                            </span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                            <input
                                type="checkbox"
                                checked={activeFilters.includes('public')}
                                onChange={() => handleToggleFilter('public')}
                                className="form-checkbox h-4 w-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                                <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                                Public Memories
                            </span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedFilters; 