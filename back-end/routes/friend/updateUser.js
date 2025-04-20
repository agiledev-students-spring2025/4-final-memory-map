import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import { authenticate } from '../../routes/auth.js';

const router = express.Router();

// update the curr user's info
router.put('/update_user', authenticate, async (req, res) => {
  const { newUsername, newPassword, profilePicture } = req.body;
  const userId = req.user._id; // pull from token

  try {
    const updateFields = {}; // store only the fields the user wants to change

    // if user wants to change username, make sure it's not already taken
    if (newUsername) {
      const existingUser = await User.findOne({ username: newUsername });

      // dont allow duplicate username
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ error: 'Username already taken.' });
      }

      updateFields.username = newUsername;
    }

    // pfp update
    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
    }

    // hash password before changing
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true, // return the updated doc
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // success
    res.json({
      message: 'User updated successfully!',
      updatedUser,
    });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
