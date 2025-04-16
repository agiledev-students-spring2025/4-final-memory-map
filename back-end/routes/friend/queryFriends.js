import express from 'express';
import User from '../../models/User.js';
import dotenv from 'dotenv';
import { authenticate } from '../auth.js';

dotenv.config();
const route = express.Router();

route.get('/query_friends', authenticate, async (req, res) => {

    try {
        const response = await User.find();
        console.log(response.data);
        const allUsers = response.data ? response.data : [];
        const friends = allUsers.filter(user => {
            return user.allFriendsId.includes(Number(userId));
        });
        res.json(friends);
    } catch (error) {
        console.error('Error fetching data from backend:', error.message);
        res.status(500).json({ error: 'Failed to fetch friend data from backend'});
    }
});

export default route;