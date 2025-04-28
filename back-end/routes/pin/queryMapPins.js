import express from 'express';
import Pin from '../../models/Pin.js';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';

const router = express.Router();

router.get('/query_map_pins', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const friendIds = user.friends || [];

        // 1 = Private (own/only visible to creator)
        // 2 = Friends only (visible to creator and friends)
        // 3 = Public (visible to everyone)
        const pins = await Pin.find({
            $or: [
                { author: req.user._id }, 
                { visibility: '3' }, 
                { visibility: '2', author: { $in: friendIds } }
            ]
        }).populate('author', 'username profilePicture');

        const transformedPins = pins.map(pin => {
            let pinType;
            if (pin.author._id.toString() === req.user._id.toString()) {
                pinType = 'own';
            } else if (pin.visibility === '3') {
                pinType = 'public'; 
            } else {
                pinType = 'friend';
            }
                
            return {
                id: pin._id,
                title: pin.title,
                description: pin.description,
                latitude: pin.location.coordinates[1],
                longitude: pin.location.coordinates[0],
                locationName: pin.locationName,
                imageUrl: pin.imageUrl,
                author: pin.author,
                authorName: pin.author.username,
                authorPicture: pin.author.profilePicture,
                pinType: pinType,
                tags: pin.tags,
                visibility: pin.visibility || '1',
                createdAt: pin.createdAt
            };
        });

        res.json(transformedPins);
    } catch (error) {
        console.error('Error fetching pins from MongoDB:', error.message);
        res.status(500).json({ error: 'Failed to fetch pins from database.' });
    }
});

export default router;
