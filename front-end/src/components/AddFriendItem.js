import React, { useState, useEffect } from 'react';
import PlusIcon from './icons/PlusIcon';
import CheckIcon from './icons/CheckIcon';
import ClockIcon from './icons/ClockIcon';

const AddFriendItem = ({ user, onFriendAdded }) => {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (userData.friends && Array.isArray(userData.friends)) {
                const isFriend = userData.friends.some(friend => {
                    const friendId = typeof friend === 'object' ? friend._id : friend;
                    return friendId === user._id;
                });
                
                if (isFriend) {
                    setStatus('friends');
                    return;
                }
            }
            
            if (userData.friendRequests && userData.friendRequests.sent && Array.isArray(userData.friendRequests.sent)) {
                const isRequestSent = userData.friendRequests.sent.some(requestId => {
                    const id = typeof requestId === 'object' ? requestId._id : requestId;
                    return id === user._id;
                });
                
                if (isRequestSent) {
                    setStatus('pending');
                    return;
                }
            }
            
            if (userData.friendRequests && userData.friendRequests.received && Array.isArray(userData.friendRequests.received)) {
                const isRequestReceived = userData.friendRequests.received.some(requestId => {
                    const id = typeof requestId === 'object' ? requestId._id : requestId;
                    return id === user._id;
                });
                
                if (isRequestReceived) {
                    setStatus('received');
                    return;
                }
            }
            
        } catch (error) {
            console.error('Error checking friend status:', error);
        }
    }, [user._id]);
    
    const handleAddClick = () => {
        if (status === 'friends') {
            setError('You are already friends with this user');
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        if (status === 'pending') {
            setError('Friend request already sent');
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        if (status === 'received') {
            setError('This user has already sent you a friend request');
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        setShowConfirmation(true);
    };
    
    const handleCancelClick = () => {
        setShowConfirmation(false);
    };
    
    const handleConfirmClick = async () => {
        try {
            setStatus('loading');
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to send friend requests');
                setStatus('error');
                setShowConfirmation(false);
                return;
            }
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/send_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user._id })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send friend request');
            }
            
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (!userData.friendRequests) {
                userData.friendRequests = { sent: [], received: [] };
            }
            if (!userData.friendRequests.sent) {
                userData.friendRequests.sent = [];
            }
            
            userData.friendRequests.sent.push(user._id);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setStatus('pending');
            
            if (onFriendAdded && typeof onFriendAdded === 'function') {
                onFriendAdded(user);
            }
            
        } catch (error) {
            console.error('Error sending friend request:', error);
            setError(error.message || 'Failed to send friend request');
            setStatus('error');
        } finally {
            setShowConfirmation(false);
        }
    };
    
    return (
        <div className="relative border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                    <img
                        src={user.profilePicture}
                        alt={user.username || 'User'}
                        className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-200"
                    />
                    <div>
                        <h3 className="font-medium text-gray-900">{user.username}</h3>
                        {user.email && (
                            <p className="text-sm text-gray-500">{user.email}</p>
                        )}
                    </div>
                </div>
                
                <div>
                    {status === 'loading' && (
                        <div className="p-1">
                            <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}
                    
                    {status === 'friends' && (
                        <span className="inline-flex items-center text-green-600 font-medium">
                            <CheckIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm">Friends</span>
                        </span>
                    )}
                    
                    {status === 'pending' && (
                        <span className="inline-flex items-center text-yellow-600 font-medium">
                            <ClockIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm">Request Sent</span>
                        </span>
                    )}
                    
                    {status === 'received' && (
                        <span className="inline-flex items-center text-blue-600 font-medium">
                            <span className="text-sm">Respond to Request</span>
                        </span>
                    )}
                    
                    {(status === 'idle' || status === 'error') && (
                        <button
                            onClick={handleAddClick}
                            className={`flex items-center ${status === 'error' ? 'text-red-600 hover:text-red-800' : 'text-blue-600 hover:text-blue-800'} transition-colors p-1`}
                            title="Send friend request"
                            aria-label="Send friend request"
                        >
                            <PlusIcon />
                        </button>
                    )}
                </div>
            </div>
            
            {error && (
                <div className="absolute right-4 top-16 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md shadow-md z-10 text-sm">
                    {error}
                </div>
            )}
            
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Send Friend Request</h3>
                        <p className="mb-4 text-gray-600">
                            Are you sure you want to send a friend request to <span className="font-medium">{user.username}</span>?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelClick}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmClick}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddFriendItem;