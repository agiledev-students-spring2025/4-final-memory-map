import express from 'express';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/pending_requests', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId)
      .populate('friendRequests.received', '_id username profilePicture');
    
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.friendRequests) {
      currentUser.friendRequests = { sent: [], received: [] };
      await currentUser.save();
    }

    const pendingRequests = currentUser.friendRequests.received.filter(request => request !== null);

    res.status(200).json({
      message: 'Pending friend requests retrieved successfully',
      pendingRequests
    });
  } catch (error) {
    console.error('Error retrieving pending friend requests:', error);
    res.status(500).json({ error: 'Failed to retrieve pending friend requests' });
  }
});

export default router; 