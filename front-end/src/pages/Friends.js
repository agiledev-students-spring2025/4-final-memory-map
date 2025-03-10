import React, { useEffect, useState } from 'react';
import FriendItem from '../components/FriendItem';
import FriendSearchBar from '../components/FriendSearchBar';

const Friends = () => {
    const [friends, setFriends] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('https://my.api.mockaroo.com/friends_page_test.json', {
            headers: {
            'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
            }
        })
        .then(response => response.json())
        .then(data => setFriends(data))
        .catch(error => console.error('Error fetching friends:', error));
    }, []);

    if (friends === null) {
        return <div>Loading...</div>; //NOTE: replace with loading component
    }

    //NOTE: Maybe do this in the backend and add a loading component in the future
    const filteredFriends = friends.filter(friend =>
        `${friend.first_name} ${friend.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col mx-auto p-3 h-full">
            <FriendSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="text-xl font-bold p-3.5 pb-0"> Social Circle </div>
            <div className="text-l text-gray-500 pl-3.5 pt-1 pb-0"> {filteredFriends.length} friends </div>
            <div className="flex-1 overflow-y-auto">
                {filteredFriends.map(friend => (
                    <FriendItem key={friend.user_id} friend={friend} />
                ))}
            </div>
        </div>
    );
};

export default Friends;