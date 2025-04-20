import React from 'react';
import Title from './Title';

const Header = () => {
    return (
        <header className="flex justify-between items-center p-3 bg-gray-50 shadow-md">
            <Title />
        </header>
    )
};

export default Header;
