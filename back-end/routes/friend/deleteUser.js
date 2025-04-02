import express from 'express';

const route = express.Router();
route.delete('/delete_user', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({error: 'userId is required' });
    }
    const userIdNum = Number(pinId);
    let found = false;
    const localIndex = localUsers.findIndex((user) => user.userId === userIdNum);
    if (localIndex !== -1) {
        localUsers.splice(localIndex, 1);
        found = true;
    }
    const mockUsers = await axios.get(MOCKAROO_URL).then((r) => r.data);
    const mockUserExists = mockUsers.some((user) => user.userId === userIdNum);
    if (mockUserExists) {
        deletedUserIds.add(userIdNum);
        found = true;
    }
    if (!found) {
        return res.status(404).json({
            error: 'User not found.'
        });
    }
    return res.json({
        message: `User ${userId} was deleted`
    });
});

export default route;