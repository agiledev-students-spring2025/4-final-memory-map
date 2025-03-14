import React, {useState} from "react";
import PinIcon from "./icons/PinIcon";
import XIcon from "./icons/XIcon";
import ViewEye from "./ViewEye";
import ExpandedLocationItem from "./ExpandedLocationItem";

const LocationItem = (props) => {
    const locationName = props.location.pin_name;
    const [viewLocationDetails, setViewLocationDetails] = useState('');

    const handleClick = () => {
        viewLocationDetails ? setViewLocationDetails(false):setViewLocationDetails(true);
    };

    const handleRemove = () => {
        alert('Removing location');
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
                            <ViewEye status={viewLocationDetails}/>
                        </button>
                        <button onClick={handleRemove}>
                            <XIcon  />
                        </button>
                    </div>
                </div>
            </div>
            <ExpandedLocationItem viewDetails={viewLocationDetails} location={props.location}/>
        </>
    )
}

export default LocationItem;