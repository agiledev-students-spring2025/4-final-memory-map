import express from 'express';
import multer from 'multer';
import path from 'path';
import { validationResult } from 'express-validator';
import User from '../../models/User.js';
import { generateToken } from '../../config/jwt.js';
import { authenticate } from '../auth.js';
import { validateLogin } from '../validators.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
  
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
});

router.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('friends', 'username profilePicture');
        res.status(200).json(user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Server error fetching profile' });
    }
});

export default router;