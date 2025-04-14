import React, { useState, useEffect } from "react";
import PinIcon from "./icons/PinIcon";
import ViewEye from "./ViewEye";
import ExpandedLocationItem from "./ExpandedLocationItem";


const LocationItem = ({ location, removeLocation }) => {
    const locationName = location.pinName;
    const [locationUser, setLocationUser] = useState(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/get_user?userId=${location.userId}`, {
            headers: {
                'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
            }
        })
        .then(response => response.json())
        .then(data => setLocationUser(data))
        .catch(error => {
            console.error('Error fetching user:', error);
            setHasError(true);
        });
    }, )
    const [viewLocationDetails, setViewLocationDetails] = useState(false);

    const handleClick = () => {
        setViewLocationDetails(!viewLocationDetails);
    };

    return (
        <>
            <div className="flex justify-between w-full py-3.5">
                <div>
                    <div className="flex gap-3">
                        <PinIcon />
                        <span className="text-lg">{locationUser.firstName}</span>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row gap-3">
                        <button onClick={handleClick}>
                            <ViewEye status={viewLocationDetails} />
                        </button>
                    </div>
                </div>
            </div>
            <ExpandedLocationItem viewDetails={viewLocationDetails} location={location} />
        </>
    );
};

export default LocationItem;