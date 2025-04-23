import express from 'express';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.delete('/api/delete_user', authenticate, async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await User.findByIdAndDelete(userId);
        
        console.log(`User ${userId} deleted successfully`);
        return res.status(200).json({ message: `User deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;