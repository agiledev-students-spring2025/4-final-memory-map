// routes/user/updateUser.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import { authenticate } from '../../routes/authenticate.js';

const router = express.Router();

// use jwt
router.put('/update_user', authenticate, async (req, res) => {
  const { newUsername, newPassword, profilePicture } = req.body;
  const userId = req.user._id; 

  try {
    const updateFields = {};

    if (newUsername) updateFields.username = newUsername;
    if (profilePicture) updateFields.profilePicture = profilePicture;

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

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

