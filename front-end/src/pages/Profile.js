import React, { useState, useEffect } from 'react';
import EditPicIcon from '../components/icons/EditPicIcon';
import ProfileNav from '../components/ProfileNav';

const Profile = () => {
  const [user, setUser] = useState({ username: '' });
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
        setUser({ username: data.username || 'unknown', ...data });
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/profile/upload-profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfileImageUrl(data.profilePicture);
        setUser(prev => ({ ...prev, profilePicture: data.profilePicture }));
        setShowUpload(false);
        setSelectedFile(null);
      } else {
        setUploadError(data.error || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setShowUpload(false);
    setUploadError('');
  };

  return (
    <div className="py-6 px-4">
      <div className="relative flex flex-col items-center">
        <div className="relative group">
          <img
            src={profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
          />
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="absolute bottom-0 right-0 p-1.5 bg-gray-700 hover:bg-gray-800 rounded-full cursor-pointer transition-colors duration-200"
            title="Change profile picture"
          >
            <EditPicIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        <h2 className="text-xl font-bold mt-4">@{user.username}</h2>
        
        {showUpload && (
          <div className="mt-5 p-4 bg-gray-50 rounded-lg shadow-sm w-full max-w-md">            
            {uploadError && (
              <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">
                {uploadError}
              </div>
            )}
            
            <div className="mb-3">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-200 file:text-gray-700
                  hover:file:bg-gray-300"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`${
                  !selectedFile || isUploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded-md text-sm transition-colors duration-200 flex-1`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={cancelUpload}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {CurrComponent}
      </div>
    </div>
  );
};

export default Profile;
