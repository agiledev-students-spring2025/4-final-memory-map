import React from 'react';
import Image from '../components/MockImage';
import EditPicIcon from '../components/icons/EditPicIcon';
import ProfileNav from '../components/ProfileNav';

const Profile = () => {
  return (
    <div>
      <div className="relative flex justify-center mt-8">
        <Image width={75} height={75} variant="default" className="absolute"/>
        <div className="absolute bottom-[-10px] left-[50%] transform translate-x-1/2 p-1.5 bg-black rounded-full">
          <EditPicIcon className="w-2 h-2 text-white" />
        </div>
      </div>
      <h1 className="font-bold mt-5 flex justify-center">Name</h1>
      <p className="font-light flex text-xs justify-center">@username</p>
      <ProfileNav />
    </div>
  );
};

export default Profile;


