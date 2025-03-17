import React, {useEffect, useState} from 'react';
import LocationItem from '../components/LocationItem';
import Loading from '../components/Loading';

const Feeds = () => {
    const [pinnedLocations, setPinnedLocations] = useState(null);

    useEffect(() => {
        fetch('https://my.api.mockaroo.com/location.json', {
            headers: {
                'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
            }
        })
        .then(response => response.json())
        .then(data => setPinnedLocations(data))
        .catch(error => console.error('Error fetching pinned location:', error));
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
                {pinnedLocations.map(location => (
                    <LocationItem key={location.pin_id} location={location} removeLocation={removeLocation} />
                ))}
            </div>
        </div>
    );
};

export default Feeds;