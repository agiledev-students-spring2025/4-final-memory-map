import React from "react";

const ExpandedLocationItem = (props) => {
    if (props.viewDetails) {
        const location = props.location;
        const formattedDate = new Date(location.createdAt).toLocaleString();
        return (
            <>
                <div className="flex-1 items-center">
                    <img src={location.imageUrl} alt={`${location.title}`} className="object-contain h-48 w-96"/>
                    <br/>
                    <span className="text-black size-2 font-semibold font-right">{formattedDate}</span>
                    <span className="flex text-black p-3.5">{location.description}</span>
                </div>
            </>
        )
    }
}

export default ExpandedLocationItem;