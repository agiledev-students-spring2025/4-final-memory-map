import express from 'express';
import dotenv from 'dotenv';
import { authenticate } from '../auth.js';
import User from '../../models/User.js';
import Pin from '../../models/Pin.js';


dotenv.config();

const router = express.Router();

router.get('/query_feed', authenticate, async (req, res) => {
  try {
    const responsePins = await Pin.find();
    const responseUser = await User.find();
    // console.log(responsePins);
    const transformedPins = responsePins.map(pin => ({
      id: pin._id,
      title: pin.title,
      description: pin.description,
      latitude: pin.location.coordinates[1],
      longitude: pin.location.coordinates[0],
      locationName: pin.locationName,
      imageUrl: pin.imageUrl,
      author: pin.author,
      createdAt: pin.createdAt
  }));
    
    const allUser = responseUser.data ? responseUser.data : [];
    const allPins = responsePins.data ? responsePins.data : [];

    const userRecord = allUser.find(user => user._id === Number(req.user._id));
    const friendsList = (userRecord && Array.isArray(userRecord.allFriendsId)) ? userRecord.allFriendsId : [];
        
    //either 1 which means the pin is public
    //or 3 the pin is private but the user is the owner of the pin
    //or 2 the pin is friends only and the user is in the friends list
    const userPins = transformedPins
      .filter(pin => {
        return pin.publicStatus === 1 ||
          (pin.publicStatus === 2 && friendsList.includes(pin.author)) ||
          (pin.author === Number(req.user._id));
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
    
        const getOrder = pin => {
          if (pin.publicStatus === 2) return 0;                 
          else if (pin.author === Number(req.user._id)) return 1;
          else return 2;
        };
        
        return getOrder(a) - getOrder(b);
      });
    res.json(transformedPins);
  } catch (error) {
    console.error('Error fetching data from back end:', error.message);
    res.status(500).json({ error: 'Failed to fetch pin data from back end.' });
  }
});

export default router;
