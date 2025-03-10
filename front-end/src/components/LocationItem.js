import React, {useState} from "react";
import PinIcon from "./icons/PinIcon";
import XIcon from "./icons/XIcon";
import Button from "./Button";
import ViewEye from "./ViewEye";

const LocationItem = (props) => {
    const locationName = props.location.pin_location_city;
    const [viewLocationDetails, setViewLocationDetails] = useState('');

    const handleClick = () => {
        viewLocationDetails ? setViewLocationDetails(false):setViewLocationDetails(true);
    };

    return (
        <div className="flex justify-between w-full p-3.5">
            <div>
                <div className="flex gap-3">
                    <PinIcon />
                    <span className="text-lg">{locationName}</span>
                </div>
            </div>
            <div>
                <div className="flex flex-row gap-3">

                    <Button onClick={handleClick}>
                        <ViewEye status={viewLocationDetails}/>
                    </Button>
                    <XIcon />
                </div>
            </div>
        </div>
    )
}

export default LocationItem;