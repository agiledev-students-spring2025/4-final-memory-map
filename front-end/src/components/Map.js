//import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapPin from './MapPin';
import data from '../tempLocationData.json';

const Map = () => {
    /*
    const [pinnedLocations, setPinnedLocations] = useState(null);

    useEffect(() => {
        fetch('https://my.api.mockaroo.com/location.json', {
            headers: {
                'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
            }
        })
        .then(response => response.json())
        .then(data => setPinnedLocations(data))
        .catch(error => console.error('Error fetching location:', error));
    }, []);
    */
    const pinnedLocations = data;

    let centerCoordinates = [40.7128, -74.0060];
    if (pinnedLocations && pinnedLocations.length) {
        centerCoordinates = [
            pinnedLocations[0].pin_location_latitude,
            pinnedLocations[0].pin_location_longitude,
        ];
    }

    return (
        <MapContainer
            center={centerCoordinates}
            zoom={13}
            className="h-[80vh]"
            attributionControl={true}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>'
            />
            {pinnedLocations &&
                pinnedLocations.map((pin, index) => (
                    <MapPin key={index} pinData={pin} />
                ))}
        </MapContainer>
    );
};

export default Map;