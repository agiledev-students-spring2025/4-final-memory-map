import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const route = express.Router();
const MOCKAROO_URL = `https://my.api.mockaroo.com/db_user.json?key=${process.env.MOCKAROO_KEY}`;

route.get('/query_friends', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required.' });
    }

    try {
        const response = await axios.get(MOCKAROO_URL);
        const allUsers = response.data;
        const friends = allUsers.filter(user => {
            return user.allFriendsId.includes(Number(userId));
        });
        res.json(friends);
    } catch (error) {
        console.error('Error fetching data from Mockaroo:', error.message);
        res.status(500).json({ error: 'Failed to fetch friend data from Mockaroo'});
    }
});

export default route;