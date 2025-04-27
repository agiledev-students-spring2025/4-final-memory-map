import React, { useState } from 'react';

const HintPopup = () => {
  const [showHint, setShowHint] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-[1000] pointer-events-auto">
      {showHint && (
        <div className="bg-gray-500 text-white px-3 py-1.5 rounded-md shadow-lg w-64">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Double-click to add memory 📍
            </p>
            <button 
              onClick={() => setShowHint(false)}
              className="text-white/70 hover:text-white flex-shrink-0 text-sm ml-2 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HintPopup; 