import express from 'express';
import { validationResult } from 'express-validator';
import User from '../../models/User.js';
import { validateRegistration } from '../validators.js';

const router = express.Router();

router.post('/', validateRegistration, async (req, res) => {
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

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

export default router;
