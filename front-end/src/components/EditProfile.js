import React, { useState } from "react";
import ProfileNav from "./ProfileNav";

const EditProfile = ({ setCurrComponent, user, setUser }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/update_user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newUsername: username,
          newPassword: newPassword || undefined, // only send if not empty
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated!");
        setUser((prevUser) => ({
          ...prevUser,
          username: data.updatedUser.username,
        }));

        setCurrComponent(
          <ProfileNav
            setCurrComponent={setCurrComponent}
            setUser={setUser}
            user={{ username: data.updatedUser.username }}
          />
        );
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error.");
    }
  };

  return (
    <div className="w-5/6 mx-auto bg-white p-6">
      <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSave}
          className={`px-4 py-2 text-white transition ${
            username ? "bg-gray-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!username}
        >
          Save and Back
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
