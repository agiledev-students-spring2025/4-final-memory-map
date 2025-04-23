import express from 'express';
import { validationResult } from 'express-validator';
import Pin from '../../models/Pin.js';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import { validatePin } from '../validators.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 
    }
});

router.post('/api/create', authenticate, upload.single('image'), validatePin, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file ? req.file.filename : 'No file');
        console.log('User ID:', req.user._id);

        const { title, description, latitude, longitude, visibility } = req.body;
        let { locationName, tags } = req.body;
        const userId = req.user._id;

        let parsedTags = [];
        if (tags) {
            try {
                if (typeof tags === 'string') {
                    parsedTags = JSON.parse(tags);
                } else {
                    parsedTags = tags;
                }
            } catch (err) {
                console.error('Error parsing tags:', err);
            }
        }
        
        if (parsedTags.length > 0) {
            const currentUser = await User.findById(userId);
            if (!currentUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const userFriends = currentUser.friends.map(friend => friend.toString());
            
            const validFriendIds = [];
            for (const friendId of parsedTags) {
                if (mongoose.Types.ObjectId.isValid(friendId) && userFriends.includes(friendId)) {
                    validFriendIds.push(friendId);
                }
            }
            
            parsedTags = validFriendIds;
        }

        console.log('Form fields:', {
            title,
            description,
            latitude,
            longitude,
            visibility,
            locationName,
            tags: parsedTags,
            userId
        });

        if (!title || !description || !latitude || !longitude || !visibility) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: { title, description, latitude, longitude, visibility }
            });
        }

        if (!locationName || locationName.trim() === '') {
            locationName = 'Unknown location';
        }
        
        console.log('Location name to be saved:', locationName);

        let imageUrl = null;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    transformation: [
                        { width: 800, height: 600, crop: 'fill' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                });
                imageUrl = result.secure_url;
                
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ 
                    error: 'Failed to upload image',
                    details: uploadError.message 
                });
            }
        }

        const newPin = new Pin({
            title,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            locationName: locationName,
            imageUrl: imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: userId,
            tags: parsedTags,
            visibility: visibility
        });

        const savedPin = await newPin.save();
        console.log('Pin saved successfully:', savedPin);
        
        res.status(201).json(savedPin);
    } catch (error) {
        console.error('Error creating pin:', error);
        res.status(500).json({ 
            error: 'Failed to create pin',
            details: error.message 
        });
    }
});

export default router;