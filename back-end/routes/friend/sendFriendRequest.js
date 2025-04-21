import express from 'express';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/send_request', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.friendRequests) {
      currentUser.friendRequests = { sent: [], received: [] };
    }
    if (!targetUser.friendRequests) {
      targetUser.friendRequests = { sent: [], received: [] };
    }

    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ error: 'User is already in your friends list' });
    }

    if (currentUser.friendRequests.sent.includes(userId)) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    if (currentUser.friendRequests.received.includes(userId)) {
      return res.status(400).json({ error: 'User has already sent you a friend request' });
    }

    currentUser.friendRequests.sent.push(userId);
    targetUser.friendRequests.received.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

export default router; 