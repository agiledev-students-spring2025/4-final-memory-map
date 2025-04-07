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

  useEffect(() => {
    fetch('http://localhost:4000/query_map_pins?userId=3')
      .then((response) => response.json())
      .then((data) => {
        setPinnedLocations(data);
      })
      .catch((error) => console.error('Error fetching pins:', error));
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

  if (pinnedLocations.length === 0) {
    return <Loading />;
  }

  const centerCoordinates = [
    pinnedLocations[0].pinLocationLatitude,
    pinnedLocations[0].pinLocationLongitude
  ];

  return (
    <MapContainer
      center={centerCoordinates}
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

      {pinnedLocations.map((pin, index) => (
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