import React from 'react';
import Image from '../components/MockImage';

const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <Image width={200} height={200} variant="circular" />
      </div>
    </div>
  );
};

export default Profile;

