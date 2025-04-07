import express from "express";
import multer from "multer";

const router = express.Router();
let localUsers = [];

router.post('/create_user', async (req, res) => {
  const { 
    userId, 
    username, 
    firstName, 
    lastName, 
    email, 
    gender, 
    birthdate, 
    password,
    profilePicture
  } = req.body;
    
  if (!userId || !username || !firstName || !lastName) {
    return res.status(400).send("Error");
  }

  // Uncomment later
  /*
  const exist = await Userdb.findOne({
    $or: [
      { username },
      { email },
      { firstName, lastName }
    ]
  });
  if (exist) {
    return res.status(409);
  }
  */

  const currNewUser = { 
    userId, 
    username, 
    firstName, 
    lastName, 
    email, 
    gender, 
    birthdate, 
    password, 
    profilePicture,
    allFriendsId: [], 
    allPinsId: [], 
    createdAt: new Date() 
  };

  localUsers.push(currNewUser);

  return res.status(201).json({
    message: "User created",
    user: {
      userId: currNewUser.userId,
      username: currNewUser.username,
      email: currNewUser.email,
      profilePicture: currNewUser.profilePicture
    }
  });
});

export default router;
