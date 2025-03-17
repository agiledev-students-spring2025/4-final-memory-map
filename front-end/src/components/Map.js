import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapPin from './MapPin';
import Loading from './Loading';

const Map = () => {
    
    const [pinnedLocations, setPinnedLocations] = useState([]);

    useEffect(() => {
        fetch('https://my.api.mockaroo.com/location.json', {
            headers: {
            'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            setPinnedLocations(data);
        })
        .catch(error => console.error('Error fetching location:', error));
    }, []);

    if (pinnedLocations.length === 0) {
        return <Loading></Loading>;
    }
    
    const centerCoordinates = [pinnedLocations[0].pin_location_latitude, pinnedLocations[0].pin_location_longitude];

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
            {pinnedLocations.map((pin, index) => (
                <MapPin key={index} pinData={pin} />
            ))}
        </MapContainer>
    );
};

export default Map;