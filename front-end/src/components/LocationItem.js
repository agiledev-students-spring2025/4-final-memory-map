import React, { useEffect} from "react";
import PinIcon from "./icons/PinIcon";
import XIcon from "./icons/XIcon";
import OpenEyeIcon from "./icons/OpenEyeIcon";

const LocationItem = (props) => {
    // const [open, setOpen] = useState(null);
    let showLocationDetails = false;
    const locationName = props.location.pin_location_city;

    useEffect(() => {
        showLocationDetails = true;
    })

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
                    <OpenEyeIcon />
                    <XIcon />
                </div>
            </div>
        </div>
    )
}

export default LocationItem;