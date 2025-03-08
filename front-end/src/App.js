import React from 'react';
import {Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Friends from './pages/Friends';
import Feeds from './pages/Feeds';
import Profile from './pages/Profile';
import NoPage from './pages/NoPage';

function App() {
  return (
    <div className="flex flex-col h-[956px] max-w-[440px] mx-auto">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}

export default App;