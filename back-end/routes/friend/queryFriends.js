import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const route = express.Router();

// let localFriends = [];
// const deletedFriendsIds = new Set();
const MOCKAROO_URL = `https://my.api.mockaroo.com/db_user.json?key=${process.env.MOCKAROO_KEY}`;
// async function getAllFriends() {
//     let mockFriends = [];
//     try {
//         const { data } = await axios.get(MOCKAROO_URL);
//         mockFriends = data;
//     } catch (error) {
//         console.error('Error fetching from Mockaroo:', error.message);
//     }
//     const filteredMockFriends = mockFriends.filter(
//         (friend) => !deletedFriendsIds.has(friend.friendId)
//     );
//     return [...filteredMockFriends, ...localFriends];
// }

// route.get('/query_friends', async (req, res) => {
//     const { userId } = req.query;
//     if (!userId) {
//         return res.status(400).json({
//             error: 'userId is required',
//         });
//     }
//     const userIdNum = Number(userId);
//     const allUsers = await getAllFriends();
//     const friends = allUsers.filter((user) => {
//         user.allFriendsId.includes(userIdNum);
//     });
//     res.json(friends);
// });

route.get('/query_friends', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required.' });
    }

    try {
        const response = await axios.get(MOCKAROO_URL);
        const allUsers = response .data;
        console.log(allUsers.userId);
        const friends = allUsers.filter((user) => {
            user.allFriendsId.includes(userId);
        });
        res.json(friends);
    } catch (error) {
        console.error('Error fetching data from Mockaroo:', error.message);
        res.status(500).json({ error: 'Failed to fetch friend data from Mockaroo'});
    }
});

export default route;