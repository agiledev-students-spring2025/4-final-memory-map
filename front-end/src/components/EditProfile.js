import React, { useState, useEffect } from "react";
import ProfileNav from "./ProfileNav";

const EditProfile = ({ setCurrComponent, user, setUser }) => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    if (!username || username.trim() === "") {
      alert("Username cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/update_user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newUsername: username,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data && data.user) {
          alert("Profile updated!");
          const updatedUser = {
            ...(user || {}),
            username: data.user.username || username,
          };
          setUser(updatedUser);

          setCurrComponent(
            <ProfileNav
              setCurrComponent={setCurrComponent}
              setUser={setUser}
              user={updatedUser}
            />
          );
        } else if (data && data.updatedUser) {
          alert("Profile updated!");
          const updatedUser = {
            ...(user || {}),
            username: data.updatedUser.username || username,
          };
          setUser(updatedUser);

          setCurrComponent(
            <ProfileNav
              setCurrComponent={setCurrComponent}
              setUser={setUser}
              user={updatedUser}
            />
          );
        } else {
          console.log("Response data:", data);
          const updatedUser = {
            ...(user || {}),
            username: username,
          };
          setUser(updatedUser);
          
          setCurrComponent(
            <ProfileNav
              setCurrComponent={setCurrComponent}
              setUser={setUser}
              user={updatedUser}
            />
          );
          alert("Profile updated");
        }
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error.");
    } finally {
      setIsLoading(false);
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
          disabled={!username || isLoading}
          className={`px-4 py-2 text-white transition ${
            username && !isLoading ? "bg-gray-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Saving..." : "Save and Back"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
