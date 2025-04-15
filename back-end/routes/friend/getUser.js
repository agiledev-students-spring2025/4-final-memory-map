//getUser.js
import express from 'express';
import { authenticate } from '../auth.js';

const router = express.Router();

router.get('/get_user', authenticate, async (req, res) => {
    try {
        res.json({
            userId: req.user._id,
            username: req.user.username
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get user information' });
    }
});

export default router;