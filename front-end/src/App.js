import React from 'react';
import {Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Friends from './pages/Friends';
import Feeds from './pages/Feeds';
import Profile from './pages/Profile';
import NoPage from './pages/NoPage';

function App() {
  const location = useLocation();
  const noNavBar = ["/login", "/register"];
  const showNavBar = !noNavBar.includes(location.pathname);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col h-[90vh] w-[40vh]">
        <div className="flex-shrink-0">
          <Header />
        </div> 
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
        {showNavBar && (
          <div className="flex-shrink-0">
            <Navbar />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;