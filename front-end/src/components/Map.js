import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl
} from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import MapPin from './MapPin';
import Loading from './Loading';
import DateFilter from './DateFilter';

import HintPopup from './map/HintPopup';
import MapControls from './map/MapControls';
import LocationControl from './map/LocationControl';
import InitialMapSetup from './map/InitialMapSetup';
import LocationSetter from './map/LocationSetter';
import RightClickHandler from './map/RightClickHandler';
import AutoOpeningPopup from './map/AutoOpeningPopup';

import { 
  getRandomDefaultLocation, 
  VISIBILITY, 
  MAP_THEMES, 
  userLocationIcon 
} from './map/MapHelpers';

const Map = () => {
  const navigate = useNavigate();
  const [pinnedLocations, setPinnedLocations] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]);
  const [rightClickLocation, setRightClickLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(['own', 'friend', 'public']);
  const [defaultLocation] = useState(getRandomDefaultLocation());
  const [currentTheme, setCurrentTheme] = useState('VOYAGER');
  const [controlsVisible, setControlsVisible] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);

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
          setLoading(false);
        }
      );
    } else {
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
          
          const processedPins = pins.map(pin => {
            if (pin.pinType) return pin;
            
            let pinType;
            if (pin.author._id === pin.userId) {
              pinType = 'own';
            } else if (pin.visibility === VISIBILITY.PUBLIC) {
              pinType = 'public';
            } else {
              pinType = 'friend';
            }
            
            return {
              ...pin,
              pinType
            };
          });
          
          setPinnedLocations(processedPins);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(pinnedLocations)) {
      const filtered = pinnedLocations.filter(pin => activeFilters.includes(pin.pinType));
      setFilteredPins(filtered);
    }
  }, [pinnedLocations, activeFilters]);

  const handleToggleFilter = (filterType) => {
    setActiveFilters(prev => {
      if (prev.includes(filterType)) {
        return prev.filter(type => type !== filterType);
      } else {
        return [...prev, filterType];
      }
    });
  };

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
          fromMap: true,
          defaultVisibility: VISIBILITY.PRIVATE
        }
      });
    }
  };

  const handleDeletePin = (deletedPinId) => {
    setPinnedLocations(prevPins => prevPins.filter(pin => pin.id !== deletedPinId));
  };

  const handleLocationSearch = (location) => {
    setSearchedLocation(location);
  };

  if (loading) {
    return <Loading />;
  }

  const mapCenter = userLocation || defaultLocation;
  const currentMapTheme = MAP_THEMES[currentTheme];

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="relative w-full h-0">
          <HintPopup />
          <div className="pointer-events-auto">
            <MapControls 
              activeFilters={activeFilters}
              handleToggleFilter={handleToggleFilter}
              handleLocationSearch={handleLocationSearch}
              currentTheme={currentTheme}
              setCurrentTheme={setCurrentTheme}
              controlsVisible={controlsVisible}
              setControlsVisible={setControlsVisible}
              MAP_THEMES={MAP_THEMES}
            />
          </div>
        </div>
      </div>
      
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        attributionControl={true}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <LocationControl userLocation={userLocation} />
        <InitialMapSetup center={[mapCenter.lat, mapCenter.lng]} />
        <LocationSetter searchedLocation={searchedLocation} />
        <TileLayer
          url={currentMapTheme.url}
          attribution={currentMapTheme.attribution}
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
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-medium">Your Location</div>
                <div className="text-xs text-gray-500">
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;