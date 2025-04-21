import React, { useEffect, useState } from 'react';
import FriendSearchBar from '../components/FriendSearchBar';
import Loading from '../components/Loading';
import AddFriendItem from '../components/AddFriendItem';

const AddFriend = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to view users');
                setIsLoading(false);
                return;
            }
            
            const response = await fetch('http://localhost:4000/query_all_users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            
            const data = await response.json();
            
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const filteredUsers = data.filter(user => user._id !== currentUser._id);
            
            setAllUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFriendStatusChange = () => {
        fetchAllUsers();
    };
    
    const filteredUsers = allUsers.filter(user => {
        const username = user?.username || '';
        return username.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
                <h1 className="text-xl font-bold">Add Friend</h1>
            </div>
            
            <div className="p-4">
                <FriendSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            
            {error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'No users match your search' : 'No users found'}
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {filteredUsers.map(user => (
                        <AddFriendItem 
                            key={user._id} 
                            user={user} 
                            onFriendAdded={handleFriendStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddFriend;