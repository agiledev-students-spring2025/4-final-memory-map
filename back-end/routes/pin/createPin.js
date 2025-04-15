import express from 'express';
import multer from 'multer';
import { validationResult } from 'express-validator';
import Pin from '../../models/Pin.js';
import { authenticate } from '../auth.js';
import { validatePin } from '../validators.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
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

        const newPin = new Pin({
            title,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
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