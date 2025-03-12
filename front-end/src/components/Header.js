import React from 'react';
import Logo from './MockImage';
import Title from './Title';

const Header = () => {
    return (
        <header className="flex justify-between items-center p-3 bg-gray-50 shadow-md">
            <Title />
            <Logo width={50} height={50}/>
        </header>
    )
};

export default Header;
