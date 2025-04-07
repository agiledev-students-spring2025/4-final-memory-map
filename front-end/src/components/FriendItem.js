import React, { useState } from "react";
import XIcon from "./icons/XIcon";

const FriendItem = ({ friend, removeFriend }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRemove = () => {
        setShowConfirm(true);
    };

    const cancelRemove = () => {
        setShowConfirm(false);
    };

    const confirmRemove = async () => {
        try {
            const response = await fetch('http://localhost:4000/delete_friend', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: friend.userId })
            });
            if (response.ok) {
                removeFriend(friend.userId);
                console.log("Friend delete success");
            } else {
                console.error("Failed to delete friend");
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
        setShowConfirm(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center">
                    <img
                        src={friend.profilePicture}
                        alt={`${friend.firstName} ${friend.lastName}`}
                        className="rounded-full mr-3"
                    />
                    <span className="text-lg">
                        {friend.firstName} {friend.lastName}
                    </span>
                </div>
                <button className="text-black-500 hover:text-gray-400" onClick={handleRemove}>
                    <XIcon />
                </button>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p className="mb-4">Are you sure you want to delete this friend?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                onClick={cancelRemove}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={confirmRemove}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendItem;