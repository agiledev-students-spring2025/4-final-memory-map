import React, { useState, useEffect } from 'react';
import Image from '../components/MockImage';
import EditPicIcon from '../components/icons/EditPicIcon';
import ProfileNav from '../components/ProfileNav';

const Profile = () => {
  const [user, setUser] = useState({ first_name: "", last_name: "", username: "" });
  const [CurrComponent, setCurrComponent] = useState(null);

  useEffect(() => {
    fetch('https://my.api.mockaroo.com/friends_page_test.json', {
      headers: {
        'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
      }
    })
      .then(response => response.json())
      .then(data => {
        const rd = Math.floor(Math.random() * data.length);
        setUser({
          first_name: data[rd]?.first_name || "First",
          last_name: data[rd]?.last_name || "Last",
          username: data[rd]?.username || "unknown"
        });
      })
      .catch(error => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    if (user) {
      setCurrComponent(<ProfileNav setCurrComponent={setCurrComponent} setUser={setUser} user={user} />);
    }
  }, [user]); 

  return (
    <div>
      <div className="relative flex justify-center mt-8">
        <Image width={75} height={75} variant="default" className="absolute" />
        <div className="absolute bottom-[-10px] left-[50%] transform translate-x-1/2 p-1.5 bg-black rounded-full">
          <EditPicIcon className="w-2 h-2 text-white" />
        </div>
      </div>
      {/* Name & Username */}
      <h1 className="font-bold mt-5 flex justify-center">
        {user.first_name} {user.last_name}
      </h1>
      <p className="font-light flex text-xs justify-center">
        @{user.username}
      </p>
      {CurrComponent}
    </div>
  );
};

export default Profile;
