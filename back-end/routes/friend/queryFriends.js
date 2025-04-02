import express from 'express';

const route = express.Router();

let localFriends = [];
const deletedFriendsIds = new Set();
const MOCKAROO_URL = `https://my.api.mockaroo.com/db_user.json?key=${process.env.MOCKAROO_KEY}`;
async function getAllFriends() {
    let mockFriends = [];
    try {
        const { data } = await axios.get(MOCKAROO_URL);
        mockFriends = data;
    } catch (error) {
        console.error('Error fetching from Mockaroo:', error.message);
    }
    const filteredMockFriends = mockFriends.filter(
        (friend) => !deletedFriendsIds.has(friend.friendId)
    );
    return [...filteredMockFriends, ...localFriends];
}

route.use('/query_friends', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({
            error: 'userId is required',
        });
    }
    const userIdNum = Number(userId);
    const allUsers = await getAllFriends();
    const friends = allUsers.filter((user) => {
        user.friends.contains(userIdNum);
    });
    res.json(friends);
});

export default route;