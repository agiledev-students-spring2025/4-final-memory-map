//import React, {useEffect, useState} from 'react';
import LocationItem from '../components/LocationItem';
import data from '../tempLocationData.json';

const Feeds = () => {
    // TODO: uncomment this for mockaroo -- we hit the daily limit
    // const [pinnedLocations, setPinnedLocations] = useState(null);

    // useEffect(() => {
    //     fetch('https://my.api.mockaroo.com/location.json', {
    //         headers: {
    //         'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => setPinnedLocations(data))
    //     .catch(error => console.error('Error fetching pinned location:', error));
    // }, []);
    const pinnedLocations = data;

    if (pinnedLocations === null) {
        return <div>Loading...</div> //TODO: loading replace
    }
    return (
        <div className="flex flex-col mx-auto p-3 h-full items-center">
            <div className="text-xl font-bold p-3.5">Feed</div>
            <div className="flex-1 overflow-y-auto w-full">
                {pinnedLocations.map(location => (
                    <LocationItem key={location.pin_id} location={location}/>
                ))}
            </div>
        </div>
    );
};

export default Feeds;