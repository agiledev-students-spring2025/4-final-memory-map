import React, { useEffect, useState } from 'react';
import PlusIcon from './icons/PlusIcon';

const AddFriendItem = ({ user }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState(false);

    const handleAddFriend = () => {
        setShowConfirm(true);
    }

    const cancelAddFriend = () => {
        setShowConfirm(false);
    }

    const confirmAddFriend = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = fetch('http://localhost:4000/add_friend', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId: user._id})
                })
                if (!response.ok) {
                    throw new Error('Failed to add friend');
                }
                const data = response.json(); // get actual response data
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to add friend. Please try again later.');
        }
        setShowConfirm(false);
    }

    return (
        <div className="relative">
            <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center">
                    <img
                        src={user.profilePicture}
                        alt={`${user.username}`}
                        className="rounded-full mr-3"
                    />
                </div>
                <button className="text-black-500 hover:text-gray-400" onClick={handleAddFriend}>
                    <PlusIcon />
                </button>

                {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p className="mb-4">Are you sure you want to add this friend?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                onClick={cancelAddFriend}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={confirmAddFriend}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    )
};

export default AddFriendItem;