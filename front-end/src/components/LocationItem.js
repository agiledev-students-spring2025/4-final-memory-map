import React, { useState, useEffect } from "react";
import PinIcon from "./icons/PinIcon";
import ExpandedLocationItem from "./ExpandedLocationItem";


const LocationItem = ({ location, removeLocation }) => {

    // TODO: make add friend route and improve friend searching

    // const [locationUser, setLocationUser] = useState(null);
    // const [hasError, setHasError] = useState(false);

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if(token) {
    //         fetch(`http://localhost:4000/get_user`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => setLocationUser(data))
    //         .catch(error => {
    //             console.error('Error fetching user:', error);
    //             setHasError(true);
    //         });
    //     }
    // }, )

    // if (locationUser) {
        return (
            <>
                <div className="flex justify-between w-full py-3.5">
                    <div>
                        <div className="flex gap-3">
                            <PinIcon/>
                            <span className="text-lg">{location.title}</span>
                        </div>
                    </div>
                </div>
                <ExpandedLocationItem viewDetails={true} location={location} />
            </>
        );
    // } else {
        // return (
        //     <>
        //         <div>
        //             Loading post
        //         </div>
        //     </>
        // )
    // }
};

export default LocationItem;