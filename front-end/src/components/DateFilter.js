import React, { useState } from 'react';

const DateFilter = ({ onDateSelect, onRandomDay, onClear, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    onDateSelect(date);
  };
  
  const handleRandomDay = () => {
    onRandomDay();
  };
  
  const handleClear = () => {
    setSelectedDate('');
    onClear();
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-64 relative">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close filter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <h3 className="text-lg font-semibold mb-3">Filter by Date</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select a date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
            onDateSelect(today);
          }}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-600 rounded-lg hover:from-pink-100 hover:to-pink-200 transition-all duration-300 text-sm font-medium shadow-sm border border-pink-100 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>Today</span>
        </button>
        <button
          onClick={handleRandomDay}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 text-sm font-medium shadow-sm border border-purple-100 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span>Random Day</span>
        </button>
      </div>
      
      <button
        onClick={handleClear}
        className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Clear
      </button>
    </div>
  );
};

export default DateFilter; 