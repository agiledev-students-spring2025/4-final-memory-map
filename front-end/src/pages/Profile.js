import React, { useState, useEffect } from 'react';
import EditPicIcon from '../components/icons/EditPicIcon';
import ProfileNav from '../components/ProfileNav';

const Profile = () => {
  const [user, setUser] = useState({ username: '' });
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [CurrComponent, setCurrComponent] = useState(null);

  // Fetch user info with JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:4000/get_user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({ username: data.username || 'unknown' });
        setProfileImageUrl(data.profilePicture);
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setCurrComponent(
        <ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} user={user} />
      );
    }
  }, [user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await fetch('http://localhost:4000/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfileImageUrl(`http://localhost:4000${data.fileUrl}`);
        alert('Upload successful!');
      } else {
        alert('Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed.');
    }
  };

  return (
    <div>
      <div className="relative flex justify-center mt-8">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-[75px] h-[75px] rounded-full object-cover"
        />
        <label
          onClick={() => setShowUpload(!showUpload)}
          className="absolute bottom-[-10px] left-[50%] transform translate-x-1/2 p-1.5 bg-black rounded-full cursor-pointer"
        >
          <EditPicIcon className="w-2 h-2 text-white" />
        </label>
      </div>

      {showUpload && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Upload
          </button>
        </div>
      )}

      <p className="font-bold mt-5 flex justify-center">@{user.username}</p>
      {CurrComponent}
    </div>
  );
};

export default Profile;
