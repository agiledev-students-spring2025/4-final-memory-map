import express from 'express';
import axios from 'axios';

const route = express.Router();

const MOCKAROO_URL = `https://my.api.mockaroo.com/db_user.json?key=${process.env.MOCKAROO_KEY}`;

route.delete('/delete_user', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    const userIdNum = Number(userId);

    const response = await axios.get(MOCKAROO_URL);
    const allUsers = response.data;
    const userIndex = allUsers.findIndex(user => user.userId === userIdNum);

    if (userIndex !== -1) {
        console.log(`User ${userId} deletion was successful.`);
        return res.json({ message: `User ${userId} deletion was successful.` });
    }

    console.log('User not found.');
    return res.status(404).json({ error: 'User not found.' });
});

export default route;