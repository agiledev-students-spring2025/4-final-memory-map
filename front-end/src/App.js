import React from 'react';
import {Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Friends from './pages/Friends';
import Feeds from './pages/Feeds';
import Profile from './pages/Profile';
import NoPage from './pages/NoPage';
import NewLocation from './pages/NewLocation';

function App() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col h-[90vh] w-[40vh]">
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-location" element={<NewLocation />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
        <div className="flex-shrink-0">
          <Navbar />
        </div>
      </div>
    </div>
  );
}

export default App;