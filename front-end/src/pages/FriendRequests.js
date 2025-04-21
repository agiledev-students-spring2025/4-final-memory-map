import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import CheckIcon from '../components/icons/CheckIcon';
import XIcon from '../components/icons/XIcon';

const FriendRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState({});

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to view friend requests');
                setIsLoading(false);
                return;
            }
            
            const response = await fetch('http://localhost:4000/pending_requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch friend requests');
            }
            
            const data = await response.json();
            setPendingRequests(data.pendingRequests || []);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            setError('Failed to load friend requests. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAcceptRequest = async (userId) => {
        try {
            setActionStatus(prev => ({ ...prev, [userId]: 'loading' }));
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to accept friend requests');
                setActionStatus(prev => ({ ...prev, [userId]: 'error' }));
                return;
            }
            
            const response = await fetch('http://localhost:4000/accept_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to accept friend request');
            }
            
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!userData.friends) userData.friends = [];
            if (!userData.friendRequests) userData.friendRequests = { sent: [], received: [] };
            if (!userData.friendRequests.received) userData.friendRequests.received = [];
            
            if (!userData.friends.some(friend => {
                const friendId = typeof friend === 'object' ? friend._id : friend;
                return friendId === userId;
            })) {
                userData.friends.push(userId);
            }
            
            userData.friendRequests.received = userData.friendRequests.received.filter(id => {
                const requestId = typeof id === 'object' ? id._id : id;
                return requestId !== userId;
            });
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            setActionStatus(prev => ({ ...prev, [userId]: 'accepted' }));
            
            setTimeout(() => {
                setPendingRequests(prev => prev.filter(request => request._id !== userId));
            }, 1500);
            
        } catch (error) {
            console.error('Error accepting friend request:', error);
            setActionStatus(prev => ({ ...prev, [userId]: 'error' }));
        }
    };
    
    const handleRejectRequest = async (userId) => {
        try {
            setActionStatus(prev => ({ ...prev, [userId]: 'loading' }));
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to reject friend requests');
                setActionStatus(prev => ({ ...prev, [userId]: 'error' }));
                return;
            }
            
            const response = await fetch('http://localhost:4000/reject_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to reject friend request');
            }
            
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!userData.friendRequests) userData.friendRequests = { sent: [], received: [] };
            if (!userData.friendRequests.received) userData.friendRequests.received = [];
            
            userData.friendRequests.received = userData.friendRequests.received.filter(id => {
                const requestId = typeof id === 'object' ? id._id : id;
                return requestId !== userId;
            });
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            setActionStatus(prev => ({ ...prev, [userId]: 'rejected' }));
            
            setTimeout(() => {
                setPendingRequests(prev => prev.filter(request => request._id !== userId));
            }, 1500);
            
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            setActionStatus(prev => ({ ...prev, [userId]: 'error' }));
        }
    };
    
    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
                <h1 className="text-xl font-bold">Friend Requests</h1>
            </div>
            
            {error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : pendingRequests.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No pending friend requests
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {pendingRequests.map(request => (
                        <div key={request._id} className="border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <img
                                        src={request.profilePicture}
                                        alt={request.username || 'User'}
                                        className="w-10 h-10 rounded-full mr-3 object-cover bg-gray-200"
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-900">{request.username}</h3>
                                        {request.email && (
                                            <p className="text-sm text-gray-500">{request.email}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    {actionStatus[request._id] === 'loading' ? (
                                        <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    ) : actionStatus[request._id] === 'accepted' ? (
                                        <span className="text-sm text-green-600">Accepted</span>
                                    ) : actionStatus[request._id] === 'rejected' ? (
                                        <span className="text-sm text-red-600">Rejected</span>
                                    ) : actionStatus[request._id] === 'error' ? (
                                        <span className="text-sm text-red-600">Error</span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleAcceptRequest(request._id)}
                                                className="p-1.5 bg-green-100 rounded-full text-green-600 hover:bg-green-200 transition-colors"
                                                title="Accept request"
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request._id)}
                                                className="p-1.5 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                                                title="Reject request"
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendRequests; 