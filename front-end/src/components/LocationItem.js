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
        <div className="flex flex-row justify-between w-full p-">
            <div>
                <div className="flex flex-row">
                    <PinIcon/>
                    <p className="px-3.5">{locationName}</p>
                </div>
            </div>
            <div>
                <div className="flex flex-row gap-2">
                    <OpenEyeIcon/>
                    <XIcon/>
                </div>
            </div>
        </div>
    )
}

export default LocationItem;