import express from 'express';
import Pin from '../../models/Pin.js';
import { authenticate } from '../auth.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.delete('/api/delete', authenticate, async (req, res) => {
    try {
        const { pinId } = req.body;

        if (!pinId) {
            return res.status(400).json({ error: 'Pin ID is required' });
        }

        const pin = await Pin.findById(pinId);
        if (!pin) {
            return res.status(404).json({ error: 'Pin not found' });
        }

        if (pin.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this pin' });
        }

        if (pin.imageUrl) {
            const publicId = pin.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Pin.findByIdAndDelete(pinId);

        res.status(200).json({
            message: 'Pin deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting pin:', error);
        res.status(500).json({
            error: 'Failed to delete pin',
            details: error.message
        });
    }
});

export default router;