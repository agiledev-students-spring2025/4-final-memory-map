import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const InitialMapSetup = ({ center }) => {
  const map = useMap();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      map.setView(center, 13);
      isInitialMount.current = false;
    }
  }, [center, map]);
  
  return null;
};

export default InitialMapSetup; 