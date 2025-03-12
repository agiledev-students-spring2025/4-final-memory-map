import React from "react";
import OpenEyeIcon from "./icons/OpenEyeIcon";
import CloseEyeIcon from "./icons/CloseEyeIcon";

const ViewEye = (props) => {
    if (props.status) {
        return (
            <CloseEyeIcon/>
        );
    } else {
        return (
            <OpenEyeIcon/>
        );
    }
}

export default ViewEye;