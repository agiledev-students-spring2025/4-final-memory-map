import React from 'react';
import logo from './icons/logo.png';

const Title = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <img src={logo} alt="Memory Map Logo" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-gray-900 text-xl font-medium tracking-tight">
        Memory Map
      </h1>
    </div>
  );
};

export default Title;
