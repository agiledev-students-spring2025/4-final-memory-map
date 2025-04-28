import React from 'react';
import { useMap } from 'react-leaflet';

const LocationControl = ({ userLocation }) => {
  const map = useMap();
  
  const handleCenterClick = () => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  };
  
  if (!userLocation) return null;
  
  return (
    <div className="absolute right-2 bottom-20 z-[1000] pointer-events-auto">
      <button 
        onClick={handleCenterClick}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none transition-colors"
        title="Center to your location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default LocationControl; 