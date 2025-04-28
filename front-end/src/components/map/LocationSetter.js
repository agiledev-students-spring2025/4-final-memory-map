import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const LocationSetter = ({ searchedLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (searchedLocation) {
      map.setView([searchedLocation.lat, searchedLocation.lng], 15);
    }
  }, [searchedLocation, map]);
  
  return null;
};

export default LocationSetter; 