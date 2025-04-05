import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const MOCKAROO_PINS_URL = `https://my.api.mockaroo.com/db_pins.json?key=${process.env.MOCKAROO_KEY}`;

router.get('/query_map_pins', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const response = await axios.get(MOCKAROO_PINS_URL);
    const allPins = response.data;
    //replace later with mongodb filter
    const userPins = allPins.filter(pin => pin.userId === Number(userId));
    res.json(userPins);
  } catch (error) {
    console.error('Error fetching data from Mockaroo:', error.message);
    res.status(500).json({ error: 'Failed to fetch pin data from Mockaroo.' });
  }
});

export default router;
