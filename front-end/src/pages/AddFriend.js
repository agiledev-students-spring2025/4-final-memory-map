import React, { useEffect, useState } from 'react';
import FriendSearchBar from '../components/FriendSearchBar';
import Loading from '../components/Loading';
import AddFriendItem from '../components/AddFriendItem';

const AddFriend = () => {

    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/query_all_users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch all users');
                }
                return response.json();
            })
            .then(data => {
                const allUsers = Array.isArray(data) ? data : [];
                setAllUsers(allUsers);
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Failed to load friends. Please try again later.');
            });
        }
    }, []);

    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (allUsers === null) {
                setError(true);
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [allUsers]);
    
    const filteredUsers = allUsers.filter(user => {
        const username = `${user?.username || ''}`;
        return username.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    return (
        <div className="flex flex-col mx-auto h-full">
            <div className="text-xl font-bold p-3.5 pb-0">Add Friend</div>
            <FriendSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map(user => (
                    <AddFriendItem key={user._id} user={user}/>
                ))}
            </div>
        </div>
    );
}

export default AddFriend;