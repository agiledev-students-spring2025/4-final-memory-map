import express from 'express';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';

const router = express.Router();

router.get('/query_friends', authenticate, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
            .populate('friends', 'username email profilePicture');
        
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const friends = currentUser.friends || [];
        
        console.log(`Found ${friends.length} friends for user ${currentUser.username}`);
        
        res.json(friends);
    } catch (error) {
        console.error('Error fetching friends:', error.message);
        res.status(500).json({ error: 'Failed to fetch friend data' });
    }
});

export default router;