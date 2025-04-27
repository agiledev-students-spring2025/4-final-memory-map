import React, { useState } from 'react';

const LocationSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSuggestions(data.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectLocation = (loc) => {
    onSearch({
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lon),
      name: loc.display_name
    });
    setSuggestions([]);
    setSearchTerm('');
  };
  
  return (
    <div>
      <form onSubmit={handleSearch} className="mb-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search location..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1.5 rounded text-sm flex-shrink-0 transition-colors"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>
      
      {suggestions.length > 0 && (
        <div className="max-h-40 overflow-y-auto text-sm border border-gray-200 rounded">
          {suggestions.map((loc, index) => (
            <div
              key={index}
              onClick={() => handleSelectLocation(loc)}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              {loc.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch; 