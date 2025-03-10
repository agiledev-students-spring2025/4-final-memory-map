import React from "react";

const Button = ({children, onClick}) => {

    return (
        <button onClick={onClick} className="font-bold py-2 px-4 rounded border-gray-400 border-2 bg-white text-gray-600 background-gray-400 hover:bg-gray-400 hover:text-white">
            {children}
        </button>
    );
};

export default Button;