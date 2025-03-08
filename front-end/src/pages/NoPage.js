import React from 'react';
import { Link } from 'react-router-dom';

const NoPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl mb-4">No page exists</h1>
            <Link to="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                Return to Landing Page
            </Link>
        </div>
    );
};

export default NoPage;