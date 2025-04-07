import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const MOCKAROO_PINS_URL = `https://my.api.mockaroo.com/db_pins.json?key=${process.env.MOCKAROO_KEY}`;
const MOCKAROO_USERS_URL = `https://my.api.mockaroo.com/db_user.json?key=${process.env.MOCKAROO_KEY}`;


router.get('/query_feed', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const responsePins = await axios.get(MOCKAROO_PINS_URL);
    const responseUser = await axios.get(MOCKAROO_USERS_URL);
    const allUser = responseUser.data;
    const allPins = responsePins.data;
    const userRecord = allUser.find(user => user.userId === Number(userId));
    const friendsList = (userRecord && Array.isArray(userRecord.allFriendsId)) ? userRecord.allFriendsId : [];
        
    //either 1 which means the pin is public
    //or 3 the pin is private but the user is the owner of the pin
    //or 2 the pin is friends only and the user is in the friends list
    const userPins = allPins
      .filter(pin => {
        return pin.publicStatus === 1 ||
          (pin.publicStatus === 2 && friendsList.includes(pin.userId)) ||
          (pin.userId === Number(userId));
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
    
        const getOrder = pin => {
          if (pin.publicStatus === 2) return 0;                 
          else if (pin.userId === Number(userId)) return 1;
          else return 2;
        };
        
        return getOrder(a) - getOrder(b);
      });
    res.json(userPins);

  } catch (error) {
    console.error('Error fetching data from Mockaroo:', error.message);
    res.status(500).json({ error: 'Failed to fetch pin data from Mockaroo.' });
  }
});

export default router;
