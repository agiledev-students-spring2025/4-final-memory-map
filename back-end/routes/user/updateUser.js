import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import { authenticate } from '../auth.js';
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
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

router.put('/update_user', authenticate, upload.single('profilePicture'), async (req, res) => {
  const { newUsername, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const updateFields = {};

    if (newUsername) {
      const existingUser = await User.findOne({ username: newUsername });

      // dont allow duplicate username
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ error: 'Username already taken.' });
      }

      updateFields.username = newUsername;
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_pictures',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
          ]
        });
        
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
        
        updateFields.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ 
          error: 'Failed to upload profile picture',
          details: uploadError.message 
        });
      }
    } else if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture;
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: 'User updated successfully!',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
