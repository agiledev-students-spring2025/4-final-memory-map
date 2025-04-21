import express from 'express';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.delete('/delete_friend', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    console.log(`Received request to delete friend with ID: ${userId}`);

    if (!userId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid friend ID format' });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.friends || !Array.isArray(currentUser.friends)) {
      console.log('User has no friends array or it is not an array');
      currentUser.friends = [];
      await currentUser.save();
      return res.status(404).json({ error: 'Friend not found in your friends list' });
    }

    console.log('Current friends:', currentUser.friends.map(f => f ? f.toString() : 'null'));
    
    const validFriends = currentUser.friends.filter(friendId => friendId != null);
    if (validFriends.length !== currentUser.friends.length) {
      console.log('Found and removed null/undefined friends');
      currentUser.friends = validFriends;
      await currentUser.save();
    }

    const friendIndex = currentUser.friends.findIndex(
      (friendId) => friendId && userId && friendId.toString() === userId.toString()
    );

    if (friendIndex === -1) {
      console.log(`Friend with ID ${userId} not found in friends list`);
      return res.status(404).json({ error: 'Friend not found in your friends list' });
    }

    currentUser.friends.splice(friendIndex, 1);
    await currentUser.save();
    
    const friendUser = await User.findById(userId);
    if (friendUser) {
      if (friendUser.friends && Array.isArray(friendUser.friends)) {
        const currentUserIndex = friendUser.friends.findIndex(
          (id) => id && currentUserId && id.toString() === currentUserId.toString()
        );
        
        if (currentUserIndex !== -1) {
          friendUser.friends.splice(currentUserIndex, 1);
          await friendUser.save();
          console.log(`Current user (${currentUserId}) also removed from friend's (${userId}) friend list`);
        } else {
          console.log(`Current user (${currentUserId}) not found in friend's friend list`);
        }
      }
    } else {
      console.log(`Friend user with ID ${userId} not found`);
    }
    
    console.log(`Friend with ID ${userId} removed successfully`);

    res.status(200).json({
      message: `Friend removed successfully`,
      userId: userId
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

export default router;