import express from 'express';
import Pin from '../../models/Pin.js';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
import { validatePin } from '../validators.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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

router.put('/update_pin', authenticate, upload.single('image'), validatePin, async (req, res) => {

  try {
    const { title, description, visibility, pinId} = req.body;
    if (!pinId) return res.status(400).json({ error: 'pinId is required.' });

    const currentPin = await Pin.findById(pinId);
    if (!currentPin) {
      return res.status(404).json({ error: 'Pin not found.' });
    }

    let { tags } = req.body;
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

    if (description) currentPin.description = description;
    if (visibility) currentPin.visibility = visibility;
    if (title) currentPin.title = title;

    if (req.file) {
      let imageUrl = null;
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });
        console.log(result);
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
      currentPin.imageUrl = imageUrl;
    }


    await currentPin.save();
  
    res.status(200).json({
      message: 'Pin updated successfully',
      pin: currentPin
    });

  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
