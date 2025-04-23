import express from 'express';
import Pin from '../../models/Pin.js';
import { authenticate } from '../auth.js';

const router = express.Router();

router.get('/api/query_map_pins', authenticate, async (req, res) => {
    try {
        const pins = await Pin.find({ author: req.user._id });
        const transformedPins = pins.map(pin => ({
            id: pin._id,
            title: pin.title,
            description: pin.description,
            latitude: pin.location.coordinates[1],
            longitude: pin.location.coordinates[0],
            locationName: pin.locationName,
            imageUrl: pin.imageUrl,
            author: pin.author,
            tags: pin.tags,
            visibility: pin.visibility || '1',
            createdAt: pin.createdAt
        }));

        res.json(transformedPins);
    } catch (error) {
        console.error('Error fetching pins from MongoDB:', error.message);
        res.status(500).json({ error: 'Failed to fetch pins from database.' });
    }
});

export default router;
