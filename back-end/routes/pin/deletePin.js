import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const MOCKAROO_PINS_URL = `https://my.api.mockaroo.com/db_pins.json?key=${process.env.MOCKAROO_KEY}`;

router.delete('/delete_pin', async (req, res) => {
  const { pinId } = req.body;

  console.log(`Received request to delete pin with ID: ${pinId}`);

  if (!pinId) {
    return res.status(400).json({ error: 'pinId is required' });
  }

  try {
    const response = await axios.get(MOCKAROO_PINS_URL);
    const allPins = response.data;
    const pinExists = allPins.some(pin => pin.id === Number(pinId));
    if (!pinExists) {
      return res.status(404).json({ error: `Pin with ID ${pinId} not found` });
    }
    return res.status(200).json({
      message: `Pin with ID ${pinId} deleted successfully`,
    });
  } catch (error) {
    console.error('Error fetching data from Mockaroo:', error.message);
    return res.status(500).json({
      error: 'Failed to delete pin from Mockaroo data',
    });
  }
});

export default router;