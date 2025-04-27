import express from 'express';
import dotenv from 'dotenv';
import { authenticate } from '../auth.js';
import User from '../../models/User.js';
import Pin from '../../models/Pin.js';
import mongoose from 'mongoose';

dotenv.config();

const router = express.Router();

router.get('/query_feed', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userFriends = currentUser.friends || [];
    
    const pins = await Pin.find().sort({ createdAt: -1 }).populate('author', 'username profilePicture');
    
    // 1 = Private 
    // 2 = Friends 
    // 3 = Public 
    const transformedPins = pins
      .filter(pin => {
        if (pin.author._id.toString() === userId.toString()) {
          return true;
        }
        
        if (pin.visibility === '3' || pin.visibility === 3) {
          return true;
        } 
        
        if ((pin.visibility === '2' || pin.visibility === 2) && 
                userFriends.some(friendId => friendId.toString() === pin.author._id.toString())) {
          return true;
        }
        
        return false;
      })
      .map(pin => {
        let pinType;
        if (pin.author._id.toString() === userId.toString()) {
          pinType = 'own';
        } else if (pin.visibility === '3' || pin.visibility === 3) {
          pinType = 'public';
        } else {
          pinType = 'friend';
        }
        
        return {
          id: pin._id,
          title: pin.title,
          description: pin.description,
          latitude: pin.location.coordinates[1],
          longitude: pin.location.coordinates[0],
          locationName: pin.locationName,
          imageUrl: pin.imageUrl,
          author: pin.author._id,
          authorName: pin.author.username,
          authorPicture: pin.author.profilePicture,
          pinType: pinType,
          tags: pin.tags,
          visibility: pin.visibility || '1',
          createdAt: pin.createdAt
        };
      });
    
    res.json(transformedPins);
  } catch (error) {
    console.error('Error fetching data from back end:', error.message);
    res.status(500).json({ error: 'Failed to fetch pin data from back end.' });
  }
});

export default router;
