import React from "react";

const ExpandedLocationItem = (props) => {
    if (props.viewDetails) {
        const location = props.location;
        const formattedDate = new Date(location.createdAt * 1000).toLocaleString();
        return (
            <>
                <div className="flex-1 items-center">
                    <img src={location.imageUrl} alt={`${location.pinLocationCity}, ${location.pinLocationCountry}`} className="object-contain h-48 w-96"/>
                    <span className="text-black size-2 font-semibold font-right">{location.pinLocationCity}, {location.pinLocationCountry}</span>
                    <br/>
                    <span className="text-black size-2 font-semibold font-right">{formattedDate}</span>
                    <span className="flex text-black p-3.5">{location.pinDescription}</span>
                </div>
            </>
        )
    }
}

export default ExpandedLocationItem;