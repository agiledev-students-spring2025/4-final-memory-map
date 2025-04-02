import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapPin from './MapPin';
import Loading from './Loading';

const Map = () => {
    const [pinnedLocations, setPinnedLocations] = useState([]);


    useEffect(() => {
        fetch('http://localhost:4000/query_map_pins?userId=7') //test for now
            .then(response => response.json())
            .then(data => {
                setPinnedLocations(data);
            })
            .catch(error => console.error('Error fetching pins from backend:', error));
    }, []);

    if (pinnedLocations.length === 0) {
        return <Loading />;
    }

    const centerCoordinates = [
        pinnedLocations[0].pinLocationLatitude,
        pinnedLocations[0].pinLocationLongitude,
    ];

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