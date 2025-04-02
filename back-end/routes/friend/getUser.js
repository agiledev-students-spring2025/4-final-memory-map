import express from "express";

const router = express.Router();

let localUsers = []; 

export const setLocalUsers = (users) => {
  localUsers = users;
};

router.get('/get_user', (req, res) => {
  const { username, user_id } = req.query;

  let foundUser = null;

  if (username) {
    foundUser = localUsers.find(user => user.username === username);
  } else if (user_id) {
    foundUser = localUsers.find(user => String(user.user_id) === String(user_id));
  } else {
    return res.status(400).json({ error: "No input" });
  }

  if (!foundUser) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(200).json({
    user: {
      user_id: foundUser.user_id,
      username: foundUser.username,
      email: foundUser.email,
      profile_picture: foundUser.profile_picture,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      gender: foundUser.gender,
      birthdate: foundUser.birthdate,
      allFriendsId: foundUser.allFriendsId,
      allPinsId: foundUser.allPinsId
    }
  });
});

export default router;
