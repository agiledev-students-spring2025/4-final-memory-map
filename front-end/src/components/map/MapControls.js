import React from 'react';
import LocationSearch from './LocationSearch';

const MapControls = ({ 
  activeFilters, 
  handleToggleFilter, 
  handleLocationSearch, 
  currentTheme, 
  setCurrentTheme, 
  controlsVisible, 
  setControlsVisible,
  MAP_THEMES 
}) => {
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="absolute left-4 top-4">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setControlsVisible(!controlsVisible);
        }}
        className={`bg-white p-3 rounded-full shadow-lg block hover:bg-gray-100 transition-colors ${controlsVisible ? 'bg-gray-100 ring-2 ring-blue-300' : ''}`}
        title="Map Controls"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div 
        className={`absolute left-0 mt-2 w-72 transition-all duration-300 ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onClick={handlePanelClick}
      >
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">Map Controls</h3>
            <button 
              onClick={() => setControlsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
            <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter Memories
            </h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={activeFilters.includes('own')}
                  onChange={() => handleToggleFilter('own')}
                  className="form-checkbox h-4 w-4 text-gray-700 rounded border-gray-300 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  <span className="inline-block w-3 h-3 bg-gray-700 rounded-full mr-2"></span>
                  Own
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={activeFilters.includes('friend')}
                  onChange={() => handleToggleFilter('friend')}
                  className="form-checkbox h-4 w-4 text-indigo-500 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                  Friend
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={activeFilters.includes('public')}
                  onChange={() => handleToggleFilter('public')}
                  className="form-checkbox h-4 w-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                  Public 
                </span>
              </label>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
            <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search Location
            </h4>
            <LocationSearch onSearch={handleLocationSearch} />
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" />
              </svg>
              Map Theme
            </h4>
            <div className="flex flex-col gap-2">
              {Object.entries(MAP_THEMES).map(([key, theme]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors">
                  <input
                    type="radio"
                    checked={currentTheme === key}
                    onChange={() => setCurrentTheme(key)}
                    className="form-radio h-4 w-4 text-blue-500 rounded-full border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{theme.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls; 