import express from 'express';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/accept_request', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    const senderUser = await User.findById(userId);
    if (!senderUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.friendRequests) {
      currentUser.friendRequests = { sent: [], received: [] };
    }
    if (!senderUser.friendRequests) {
      senderUser.friendRequests = { sent: [], received: [] };
    }

    const requestIndex = currentUser.friendRequests.received.findIndex(
      id => id && id.toString() === userId
    );
    
    if (requestIndex === -1) {
      return res.status(400).json({ error: 'No friend request found from this user' });
    }

    if (currentUser.friends && currentUser.friends.some(id => id && id.toString() === userId)) {
      currentUser.friendRequests.received.splice(requestIndex, 1);
      const senderRequestIndex = senderUser.friendRequests.sent.findIndex(
        id => id && id.toString() === currentUserId.toString()
      );
      if (senderRequestIndex !== -1) {
        senderUser.friendRequests.sent.splice(senderRequestIndex, 1);
      }
      
      await currentUser.save();
      await senderUser.save();
      
      return res.status(400).json({ error: 'User is already in your friends list' });
    }

    if (!currentUser.friends) currentUser.friends = [];
    if (!senderUser.friends) senderUser.friends = [];
    
    currentUser.friends.push(userId);
    senderUser.friends.push(currentUserId);

    currentUser.friendRequests.received.splice(requestIndex, 1);
    const senderRequestIndex = senderUser.friendRequests.sent.findIndex(
      id => id && id.toString() === currentUserId.toString()
    );
    if (senderRequestIndex !== -1) {
      senderUser.friendRequests.sent.splice(senderRequestIndex, 1);
    }

    await currentUser.save();
    await senderUser.save();

    res.status(200).json({
      message: 'Friend request accepted',
      user: {
        _id: senderUser._id,
        username: senderUser.username,
        profilePicture: senderUser.profilePicture
      }
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

export default router; 