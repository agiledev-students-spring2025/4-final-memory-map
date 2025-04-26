import React, { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { addPinIcon } from './MapHelpers';

const AutoOpeningPopup = ({ position, onConfirm }) => {
  const popupRef = useRef();
  const map = useMap();

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current._source.openPopup();
    }
  }, [position, map]);

  return (
    <Marker position={position} icon={addPinIcon}>
      <Popup ref={popupRef} className="modern-popup">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium 
                     transition-all duration-200 hover:bg-gray-700 active:scale-95 
                     flex items-center justify-center gap-2"
          >
            <span>Add memory</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default AutoOpeningPopup; 