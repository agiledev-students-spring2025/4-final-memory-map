import React, { useState, useEffect } from "react";
import PinIcon from "./icons/PinIcon";
import ViewEye from "./ViewEye";
import ExpandedLocationItem from "./ExpandedLocationItem";


const LocationItem = ({ location, removeLocation }) => {
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

    if (locationUser) {
        return (
            <>
                <div className="flex justify-between w-full py-3.5">
                    <div>
                        <div className="flex gap-3">
                            <img
                                src={locationUser.profilePicture}
                                alt={`${locationUser.firstName} ${locationUser.lastName}`}
                                className="rounded-full mr-3"
                            />
                            <span className="text-lg">{locationUser.firstName}</span>
                        </div>
                    </div>
                </div>
                <ExpandedLocationItem viewDetails={true} location={location} />
            </>
        );
    } else {
        return (
            <>
                <div>
                    Loading post
                </div>
            </>
        )
    }
};

export default LocationItem;