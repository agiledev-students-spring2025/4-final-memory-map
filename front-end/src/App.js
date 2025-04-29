import React from 'react';
import {Route, Routes, useLocation, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Friends from './pages/Friends';
import Feeds from './pages/Feeds';
import Profile from './pages/Profile';
import NoPage from './pages/NoPage';
import NewLocation from './pages/NewLocation';
import AddFriend from './pages/AddFriend';
import FriendRequests from './pages/FriendRequests';
import UserProfile from './pages/UserProfile';
import UpdateLocation from './pages/UpdateLocation';

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
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-location" element={<NewLocation />} />
            <Route path="/update-location" element={<UpdateLocation />} />
            <Route path="/add-friend" element={<AddFriend />} />
            <Route path="/friend-requests" element={<FriendRequests />} />
            <Route path="/user-profile" element={<UserProfile />} />
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
