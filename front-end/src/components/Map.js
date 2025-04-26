import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent
} from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import MapPin from './MapPin';
import Loading from './Loading';
import DateFilter from './DateFilter';

const RightClickHandler = ({ onRightClick, onLeftClick }) => {
  useMapEvent({
    dblclick: (e) => {
      onRightClick(e.latlng);
    },
    click: () => {
      onLeftClick();
    }
  });
  return null;
};

const AutoOpeningPopup = ({ position, onConfirm }) => {
  const popupRef = useRef();
  const map = useMap();

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current._source.openPopup();
    }
  }, [position, map]);

  return (
    <Marker position={position}>
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

const HintPopup = () => {
  const [showHint, setShowHint] = useState(true);

  return showHint ? (
    <div className="absolute top-4 right-4 z-[1000] bg-gray-500 text-white px-3 py-1.5 rounded-md shadow-lg w-64">
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
  ) : null;
};

const Map = () => {
  const navigate = useNavigate();
  const [pinnedLocations, setPinnedLocations] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]);
  const [rightClickLocation, setRightClickLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isRandomDay, setIsRandomDay] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:4000/query_map_pins', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch pins');
          }
          return response.json();
        })
        .then(data => {
          const pins = Array.isArray(data) ? data : [];
          setPinnedLocations(pins);
          setFilteredPins(pins);
        })
        .catch(error => {
          console.error('Error:', error);
          setError('Failed to load pins. Please try again later.');
        });
    }
  }, []);

  const handleRightClick = (latlng) => {
    setRightClickLocation(latlng);
  };

  const handleLeftClick = () => {
    setRightClickLocation(null);
  };

  const handleConfirmCreate = () => {
    if (rightClickLocation) {
      navigate('/new-location', {
        state: {
          lat: rightClickLocation.lat,
          lng: rightClickLocation.lng,
          fromMap: true
        }
      });
    }
  };

  const handleDeletePin = (deletedPinId) => {
    setPinnedLocations(prevPins => prevPins.filter(pin => pin.id !== deletedPinId));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsRandomDay(false);
    if (!date) {
      setFilteredPins(pinnedLocations);
      return;
    }
    
    const selectedDateObj = new Date(date);
    const filtered = pinnedLocations.filter(pin => {
      const pinDate = new Date(pin.createdAt);
      return (
        pinDate.getFullYear() === selectedDateObj.getFullYear() &&
        pinDate.getMonth() === selectedDateObj.getMonth() &&
        pinDate.getDate() === selectedDateObj.getDate()
      );
    });
    
    setFilteredPins(filtered);
  };
  
  const handleRandomDay = () => {
    if (pinnedLocations.length === 0) return;
    
    const uniqueDates = [...new Set(pinnedLocations.map(pin => {
      const date = new Date(pin.createdAt);
      return date.toISOString().split('T')[0];
    }))];
    
    const randomDate = uniqueDates[Math.floor(Math.random() * uniqueDates.length)];
    setSelectedDate(randomDate);
    setIsRandomDay(true);
    handleDateSelect(randomDate);
  };
  
  const handleClearFilter = () => {
    setSelectedDate(null);
    setIsRandomDay(false);
    setFilteredPins(pinnedLocations);
  };

  const handleOnThisDay = () => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    
    const filtered = pinnedLocations.filter(pin => {
      const pinDate = new Date(pin.createdAt);
      return pinDate.getMonth() === month && pinDate.getDate() === day;
    });
    
    setFilteredPins(filtered);
    setSelectedDate(null);
    setIsRandomDay(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const defaultCenter = userLocation || { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        attributionControl={true}
      >
        <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end space-y-2 w-fit">
          <HintPopup />
          
          <div className="flex flex-col items-end space-y-2 w-fit">
            {selectedDate && !isRandomDay && (
              <div className="bg-white px-3 py-1.5 rounded-md shadow-sm text-sm text-gray-600 flex items-center space-x-2 animate-fade-in transition-all duration-300">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
                </span>
                <button 
                  onClick={handleClearFilter}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {filteredPins.length !== pinnedLocations.length && !selectedDate && (
              <div className="bg-white px-3 py-1.5 rounded-md shadow-sm text-sm text-gray-600 flex items-center space-x-2 animate-fade-in transition-all duration-300">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  On This Day
                </span>
                <button 
                  onClick={handleClearFilter}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`group p-2 rounded-lg shadow-lg flex items-center justify-end transition-all duration-300 relative w-fit hover:scale-105 active:scale-95 ${selectedDate ? 'bg-black hover:bg-gray-900' : 'bg-white hover:bg-gray-100'}`}
            >
              <span className="text-sm font-medium text-gray-700 absolute right-12 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-white/90 px-2 py-1 rounded-md shadow-sm transform translate-x-2 group-hover:translate-x-0">
                {selectedDate 
                  ? isRandomDay 
                    ? `Random: ${new Date(selectedDate + 'T00:00:00').toLocaleDateString()}`
                    : `Date: ${new Date(selectedDate + 'T00:00:00').toLocaleDateString()}`
                  : 'Filter by Date'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 group-hover:rotate-12 ${selectedDate ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={handleOnThisDay}
              className={`group p-2 rounded-lg shadow-lg flex items-center justify-end transition-all duration-300 relative w-fit hover:scale-105 active:scale-95 ${filteredPins.length !== pinnedLocations.length && !selectedDate ? 'bg-black hover:bg-gray-900' : 'bg-white hover:bg-gray-100'}`}
            >
              <span className="text-sm font-medium text-gray-700 absolute right-12 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-white/90 px-2 py-1 rounded-md shadow-sm transform translate-x-2 group-hover:translate-x-0">
                On This Day
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 group-hover:rotate-12 ${filteredPins.length !== pinnedLocations.length && !selectedDate ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {showDateFilter && (
            <div className="mt-2">
              <DateFilter 
                onDateSelect={handleDateSelect}
                onRandomDay={handleRandomDay}
                onClear={handleClearFilter}
                onClose={() => setShowDateFilter(false)}
              />
            </div>
          )}
        </div>

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
        />

        <RightClickHandler
          onRightClick={handleRightClick}
          onLeftClick={handleLeftClick}
        />

        {Array.isArray(filteredPins) && filteredPins.map((pin, index) => (
          <MapPin key={index} pinData={pin} onDelete={handleDeletePin} />
        ))}

        {rightClickLocation && (
          <AutoOpeningPopup
            position={rightClickLocation}
            onConfirm={handleConfirmCreate}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;