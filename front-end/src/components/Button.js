import React from "react";

export function Button(props) {
    const handleClick = () => {
        alert(`Button clicked with title ${props.title}!`);
    };

    return (
        <button onClick={handleClick} className="my-button">
            {props.title}
        </button>
    )
}