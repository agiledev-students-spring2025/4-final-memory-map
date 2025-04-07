import React, { useState, useEffect } from 'react';
import EditPicIcon from '../components/icons/EditPicIcon';
import ProfileNav from '../components/ProfileNav';

const Profile = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", username: "" });
  const [CurrComponent, setCurrComponent] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const userId = 3;
    fetch(`http://localhost:4000/get_user?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        setUser({
          firstName: data.firstName || "First",
          lastName: data.lastName || "Last",
          username: data.userName || "unknown"
        });
        setProfileImageUrl(data.profilePicture);
      })
      .catch(error => console.error("Error fetching user data:", error));
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

    const FD = new FormData();
    FD.append('avatar', selectedFile);
    FD.append('username', user.username);

    const res = await fetch('http://localhost:4000/profile', {
      method: 'POST',
      body: FD
    });

    const data = await res.json();
    if (res.ok) {
      setProfileImageUrl(`http://localhost:4000${data.fileUrl}`);
      alert('Upload successful!');
    } else {
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

      <h1 className="font-bold mt-5 flex justify-center">
        {user.firstName} {user.lastName}
      </h1>
      <p className="font-light flex text-xs justify-center">
        @{user.username}
      </p>
      {CurrComponent}
    </div>
  );
};

export default Profile;
