import React, { useState } from "react";
import XIcon from "./icons/XIcon";

const FriendItem = ({ friend, removeFriend }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleRemove = () => {
        setShowConfirm(true);
    };

    const cancelRemove = () => {
        setShowConfirm(false);
    };

    const confirmRemove = async () => {
        try {
            setIsDeleting(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to remove friends');
                setIsDeleting(false);
                setShowConfirm(false);
                return;
            }
            
            console.log(`Attempting to remove friend with ID: ${friend._id}`);
            
            const response = await fetch('http://localhost:4000/delete_friend', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: friend._id })
            });
            
            const data = await response.json().catch(() => ({}));
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove friend');
            }
            
            console.log(`Server response:`, data);
            
            if (removeFriend && typeof removeFriend === 'function') {
                removeFriend(friend._id);
            }
            
            console.log("Friend removed successfully");
        } catch (error) {
            console.error("Error removing friend:", error);
            setError(error.message || 'Failed to remove friend');
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (!friend) return null;

    return (
        <div className="relative border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                    <img
                        src={friend.profilePicture}
                        alt={friend.username || 'Friend'}
                        className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-200"
                    />
                    <div>
                        <h3 className="font-medium text-gray-900">{friend.username}</h3>
                        {friend.email && (
                            <p className="text-sm text-gray-500">{friend.email}</p>
                        )}
                    </div>
                </div>
                
                <button 
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    onClick={handleRemove}
                    disabled={isDeleting}
                    aria-label="Remove friend"
                >
                    {isDeleting ? (
                        <div className="h-5 w-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                    ) : (
                        <XIcon />
                    )}
                </button>
            </div>
            
            {error && (
                <div className="absolute right-4 top-16 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md shadow-md z-10 text-sm">
                    {error}
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[40vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-2">Remove Friend</h3>
                        <p className="mb-4 text-gray-600">
                            Are you sure you want to remove <span className="font-medium">{friend.username}</span> from your friends?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelRemove}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemove}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Removing...' : 'Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendItem;