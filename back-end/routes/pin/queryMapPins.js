import express from 'express';
import Pin from '../../models/Pin.js';
import { authenticate } from '../auth.js';

const router = express.Router();

router.get('/query_map_pins', authenticate, async (req, res) => {
    try {
        const pins = await Pin.find({ author: req.user._id });
        const transformedPins = pins.map(pin => ({
            id: pin._id,
            title: pin.title,
            description: pin.description,
            latitude: pin.location.coordinates[1],
            longitude: pin.location.coordinates[0],
            imageUrl: pin.imageUrl,
            author: pin.author,
            createdAt: pin.createdAt
        }));

        res.json(transformedPins);
    } catch (error) {
        console.error('Error fetching pins from MongoDB:', error.message);
        res.status(500).json({ error: 'Failed to fetch pins from database.' });
    }
});

export default router;
