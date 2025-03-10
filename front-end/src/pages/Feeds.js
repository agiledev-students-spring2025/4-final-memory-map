import React from 'react';

const Feeds = () => {
    const [pinned_location, set_pinned_location] = useState(null);

    useEffect(() => {
        fetch('https://my.api.mockaroo.com/location.json', {
            headers: {
                'X-API-Key': ProcessingInstruction.env.REACT_APP_MOCKAROO_KEY
            }
        })
        .then(response => response.json())
        .then(data => set_pinned_location(data))
        .catch(error => console.error('Error fetching pinned location:', error));
    }, []);

    if (friends === null) {
        return <div>Loading...</div> //TODO: loading replace
    }
    return (
        <div className="flex flex-col mx-auto p-3 h-full">
            <div className="text-xl font-bold p-3.5 pb-0">Feed</div>
        </div>
    );
};

export default Feeds;