import express from 'express';
import dotenv from 'dotenv';
import { authenticate } from '../auth.js';
import User from '../../models/User.js';
import Pin from '../../models/Pin.js';
import mongoose from 'mongoose';

dotenv.config();

const router = express.Router();

router.get('/api/query_feed', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userFriends = currentUser.friends || [];
    
    const pins = await Pin.find().sort({ createdAt: -1 });
    
    const transformedPins = pins
      .filter(pin => {
        if (pin.author.toString() === userId.toString()) {
          return true;
        }
        
        if (pin.visibility === '1' || pin.visibility === 1) {
          return true;
        } else if ((pin.visibility === '2' || pin.visibility === 2) && 
                  userFriends.some(friendId => friendId.toString() === pin.author.toString())) {
          return true;
        }
        
        return false;
      })
      .map(pin => ({
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
    console.error('Error fetching data from back end:', error.message);
    res.status(500).json({ error: 'Failed to fetch pin data from back end.' });
  }
});

export default router;
