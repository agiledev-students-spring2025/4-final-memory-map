import L from 'leaflet';
import { DEFAULT_LOCATIONS, VISIBILITY, MAP_THEMES } from './constants';
import { addPinIconUrl, userLocationIconUrl } from './icons';

export { DEFAULT_LOCATIONS, VISIBILITY, MAP_THEMES };

export const getRandomDefaultLocation = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_LOCATIONS.length);
  return DEFAULT_LOCATIONS[randomIndex];
};

export const addPinIcon = L.icon({
  iconUrl: addPinIconUrl,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34]
});

export const userLocationIcon = L.icon({
  iconUrl: userLocationIconUrl,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
}); 