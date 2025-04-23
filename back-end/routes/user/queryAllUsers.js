import express from 'express';
import User from '../../models/User.js';
import dotenv from 'dotenv';
import { authenticate } from '../auth.js';

dotenv.config();
const route = express.Router();

route.get('/query_all_users', authenticate, async (req, res) => {
    try {
        const currentUserId = req.user._id;
        
        const responseUsers = await User.find({ _id: { $ne: currentUserId } });
        
        res.json(responseUsers);
    } catch (error) {
        console.error('Error fetching data from backend:', error.message);
        res.status(500).json({ error: 'Failed to fetch all user data from backend'});
    }
});

export default route;