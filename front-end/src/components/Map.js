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
    contextmenu: (e) => {
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
      <Popup ref={popupRef}>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Create a new memory here?</p>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Yes, create here
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

const Map = () => {
  const navigate = useNavigate();
  const [pinnedLocations, setPinnedLocations] = useState([]);
  const [rightClickLocation, setRightClickLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
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
    };

    getUserLocation();
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
          latitude: rightClickLocation.lat,
          longitude: rightClickLocation.lng
        }
      });
    }
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

  const defaultCenter = userLocation || { lat: 0, lng: 0 };

  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={13}
      className="h-[80vh] w-full"
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
      />

      <RightClickHandler
        onRightClick={handleRightClick}
        onLeftClick={handleLeftClick}
      />

      {Array.isArray(pinnedLocations) && pinnedLocations.map((pin, index) => (
        <MapPin key={index} pinData={pin} />
      ))}

      {rightClickLocation && (
        <AutoOpeningPopup
          position={rightClickLocation}
          onConfirm={handleConfirmCreate}
        />
      )}
    </MapContainer>
  );
};

export default Map;