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
  const [rightClickLocation, setRightClickLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      fetch(`${process.env.REACT_APP_API_URL}/query_map_pins`, {
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
        <div className="absolute top-4 right-4 z-[1000]">
          <HintPopup />
        </div>

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
        />

        <RightClickHandler
          onRightClick={handleRightClick}
          onLeftClick={handleLeftClick}
        />

        {Array.isArray(pinnedLocations) && pinnedLocations.map((pin, index) => (
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