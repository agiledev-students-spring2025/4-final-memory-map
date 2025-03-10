import React from "react";

const ExpandedLocationItem = (props) => {
    if (props.viewDetails) {
        const location = props.location;
        return (
            <>
                <div className="flex-1 items-center">
                    <img src={location.image_url} alt={`${location.pin_location_city}, ${location.pin_location_country}`} className="object-contain h-48 w-96"/>
                    <span className="text-black size-2 font-semibold font-right">{location.pin_location_city}, {location.pin_location_country}</span>
                    <br/>
                    <span className="text-black size-2 font-semibold font-right">{location.pin_created_at}</span>
                    <span className="flex text-black p-3.5">{location.pin_description}</span>
                </div>
            </>
        )
    }
}

export default ExpandedLocationItem;