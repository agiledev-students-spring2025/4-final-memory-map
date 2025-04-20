import express from 'express';
import { validationResult } from 'express-validator';
import Pin from '../../models/Pin.js';
import { authenticate } from '../auth.js';
import { validatePin } from '../validators.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024 
    }
});

router.post('/create', authenticate, upload.single('image'), validatePin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, latitude, longitude, tags } = req.body;
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { 
                    resource_type: 'auto',
                    transformation: [
                        { width: 1000, crop: "scale" },
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            
            stream.end(req.file.buffer);
        });

        const newPin = new Pin({
            title,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            imageUrl: result.secure_url,
            author: userId,
            tags: tags || []
        });

        const savedPin = await newPin.save();
        
        res.status(201).json({
            message: 'Pin created successfully',
            pin: savedPin
        });
    } catch (error) {
        console.error('Error creating pin:', error);
        res.status(500).json({
            error: 'Failed to create pin',
            details: error.message
        });
    }
});

export default router;