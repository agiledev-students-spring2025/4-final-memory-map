import React, { useEffect, useState } from 'react';
import FriendItem from '../components/FriendItem';
import FriendSearchBar from '../components/FriendSearchBar';
import Loading from '../components/Loading';

const Friends = () => {
    const [friends, setFriends] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/query_friends', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch friends');
                }
                return response.json();
            })
            .then(data => {
                const friends = Array.isArray(data) ? data : [];
                setFriends(friends);
            })
            .catch(error => {
                console.error('Error:', error);
                setHasError('Failed to load friends. Please try again later.');
            });
        }
    }, []);

    // useEffect(() => {
    //     fetch('http://localhost:4000/query_friends?userId=3', {
    //         headers: {
    //             'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => setFriends(data))
    //     .catch(error => {
    //         console.error('Error fetching friends:', error);
    //         setHasError(true);
    //     });
    // }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (friends === null) {
                setHasError(true);
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [friends]);

    const removeFriend = (userId) => {
        setFriends(prevFriends => prevFriends.filter(friend => friend.userId !== userId));
    };

    if (hasError) {
        return <div>Something went wrong with the backend server</div>;
    }

    if (friends === null) {
        return <Loading />;
    }

    const filteredFriends = friends.filter(friend => {
        const fullName = `${friend?.firstName || ''} ${friend?.lastName || ''}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col mx-auto h-full">
            <FriendSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="text-xl font-bold p-3.5 pb-0">Social Circle</div>
            <div className="text-l text-gray-500 pl-3.5 pt-1 pb-0">
                {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'}
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredFriends.map(friend => (
                    <FriendItem key={friend.userId} friend={friend} removeFriend={removeFriend} />
                ))}
            </div>
        </div>
    );
};

export default Friends;