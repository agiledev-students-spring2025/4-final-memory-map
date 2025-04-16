import React, {useEffect, useState} from 'react';
import LocationItem from '../components/LocationItem';
import Loading from '../components/Loading';

const Feeds = () => {
    const [pinnedLocations, setPinnedLocations] = useState(null);
    const [hasError, setHasError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/query_feed', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch feed');
                }
                response.json()
            })
            .then(data => {
                const locations = Array.isArray(data) ? data : [];
                setPinnedLocations(locations);
            })
            .catch(error => {
                console.error('Error fetching pinned location:', error);
                setHasError('Unable to load pins');
            });
        }
    }, []);
    
    const removeLocation = (pinId) => {
        setPinnedLocations(pinnedLocations.filter(location => location.pin_id !== pinId));
    };

    if (pinnedLocations === null) {
        return <Loading></Loading>;
    }

    return (
        <div className="flex flex-col mx-auto p-3 h-full items-center">
            <div className="text-xl font-bold p-3.5">Feed</div>
            <div className="flex-1 overflow-y-auto w-full">
                {pinnedLocations.map((location, index) => (
                    <LocationItem key={index} location={location} removeLocation={removeLocation} />
                ))}
            </div>
        </div>
    );
};

export default Feeds;