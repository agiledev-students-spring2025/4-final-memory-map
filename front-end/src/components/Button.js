import React from "react";

const MyButton = ({children, onClick}) => {
    const CLASSES = [
        "font-bold",
        "py-2",
        "px-4",
        "rounded",
        "border-gray-400",
        "border-2",
        "bg-white",
        "text-gray-600",
        "background-gray-400",
        "hover:bg-gray-400",
        "hover:text-white",
    ].join(" ");

    return (
        <button onClick={onClick} class={CLASSES}>
            {children}
        </button>
    );
};

export default MyButton;