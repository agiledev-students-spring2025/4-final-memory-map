import React from "react";
import XIcon from "./icons/XIcon";

const FriendItem = ({ friend, removeFriend }) => {
    return (
        <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center">
                <img src={friend.profilePicture} alt={`${friend.firstName} ${friend.lastName}`} className="rounded-full mr-3" />
                <span className="text-lg">{friend.firstName} {friend.lastName}</span>
            </div>
            <button className="text-black-500 hover:text-gray-400" onClick={() => removeFriend(friend.userId)}>
                <XIcon />
            </button>
        </div>
    );
}

export default FriendItem;