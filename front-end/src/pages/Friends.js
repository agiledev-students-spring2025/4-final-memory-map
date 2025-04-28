import React, { useEffect, useState } from 'react';
import FriendItem from '../components/FriendItem';
import FriendSearchBar from '../components/FriendSearchBar';
import Loading from '../components/Loading';
import PlusIcon from '../components/icons/PlusIcon';
import BellIcon from '../components/icons/BellIcon';
import { Link } from 'react-router-dom';

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

    useEffect(() => {
        fetchFriends();
        checkPendingRequests();
    }, []);

    const checkPendingRequests = () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (userData.friendRequests && 
                userData.friendRequests.received && 
                Array.isArray(userData.friendRequests.received)) {
                
                const validRequests = userData.friendRequests.received.filter(req => req !== null);
                setPendingRequestsCount(validRequests.length);
            } else {
                setPendingRequestsCount(0);
            }
        } catch (error) {
            console.error('Error checking pending friend requests:', error);
            setPendingRequestsCount(0);
        }
    };

    const fetchFriends = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to view friends');
                setIsLoading(false);
                return;
            }
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/query_friends`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch friends');
            }
            
            const data = await response.json();
            console.log('Friends loaded:', data);
            setFriends(Array.isArray(data) ? data : []);
            
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser) {
                currentUser.friends = data;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        setFriends(prevFriends => prevFriends.filter(friend => friend._id !== friendId));
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser && currentUser.friends) {
            currentUser.friends = currentUser.friends.filter(friend => 
                typeof friend === 'object' 
                    ? friend._id !== friendId 
                    : friend !== friendId
            );
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        setTimeout(() => {
            fetchFriends();
        }, 1000);
    };

    const filteredFriends = friends.filter(friend => {
        const username = friend?.username || '';
        return username.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4">
                <FriendSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            
            <div className="mx-4 mb-4 flex justify-between">
                <Link to="/add-friend" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Add Friend</span>
                </Link>
                
                <Link to="/friend-requests" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors relative">
                    <BellIcon className="w-5 h-5 mr-2" />
                    <span>Friend Requests</span>
                    {pendingRequestsCount > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                            {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                        </span>
                    )}
                </Link>
            </div>
            
            <div className="px-4 border-b border-gray-200 pb-2">
                <h1 className="text-xl font-bold">Social Circle</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'}
                </p>
            </div>
            
            {error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : filteredFriends.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-500">
                    <p className="mb-2">You don't have any friends yet</p>
                    <Link 
                        to="/add-friend"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Find Friends
                    </Link>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {filteredFriends.map(friend => (
                        <FriendItem 
                            key={friend._id} 
                            friend={friend} 
                            removeFriend={handleRemoveFriend} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Friends;