import express from 'express';
import { validationResult } from 'express-validator';
import User from '../../models/User.js';
import { generateToken } from '../../config/jwt.js';
import { validateRegistration } from '../validators.js';

const router = express.Router();


router.post('/api/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists',
                field: existingUser.email === email ? 'email' : 'username'
            });
        }

        const user = new User({ 
            username, 
            email, 
            password,
            profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
        });
        
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Server error during registration',
            details: error.message 
        });
    }
});

export default router;
