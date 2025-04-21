import express from 'express';
import dotenv from 'dotenv';
import User from '../../models/User.js';
import { authenticate } from "../auth.js";

const router = express.Router();

let localFriends = [];

export const setLocalFriends = (friends) => {
    localFriends = friends;
}

// update
router.put('/add_friend', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id}); 
        console.log(user);
        const friend = await User.find({ _id: req.body.userId});

        if (!friend) return res.status(404).json({ error: 'Friend not found.'});
        if (!user.friends || user.friends == null) user.friends = [];

        if (!user.friends.includes(req.body.userId)) {
            user.friends.push(req.body.userId);
        }

        const updatedUser = await user.save();
        
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.error('Error adding friend: ', error);
        res.status(500).json({error: 'failed to add friend'});
    }
});

export default router;