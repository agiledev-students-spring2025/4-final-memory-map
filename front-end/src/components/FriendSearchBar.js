import React from 'react';

const FriendSearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="p-3.5 pb-2">
            <input
                type="text"
                placeholder="Add or search for friend(s)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-3xl focus:outline-none indent-2 text-md"
            />
        </div>
    );
};

export default FriendSearchBar;