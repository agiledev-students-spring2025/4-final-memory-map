import React from "react";

import XIcon from "./icons/XIcon";

const FriendItem = ({ friend }) => {
    return (
        <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center">
                <img src={friend.profile_picture} alt={`${friend.firstName} ${friend.lastName}`} className="rounded-full mr-3" />
                <span className="text-lg">{friend.first_name} {friend.last_name}</span>
            </div>
            <button className="text-black-500 hover:text-gray-400">
                <XIcon />
            </button>
        </div>
    );
}

export default FriendItem;