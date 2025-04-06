import React, { useState } from "react";
import PinIcon from "./icons/PinIcon";
import ViewEye from "./ViewEye";
import ExpandedLocationItem from "./ExpandedLocationItem";

const LocationItem = ({ location, removeLocation }) => {
    const locationName = location.pinName;
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
                        <span className="text-lg">{locationName}</span>
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