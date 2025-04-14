import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const route = express.Router();
const MOCKAROO_URL = `https://my.api.mockaroo.com/db_user.json?key=${process.env.MOCKAROO_KEY}`;

route.put('/update_user', async (req, res) => {
  const { userId, firstName, lastName } = req.body;

  if (!userId || !firstName || !lastName) {
    return res.status(400).json({ error: 'userId, firstName, and lastName are required.' });
  }

  try {
    // fetch data from mockaroo
    const response = await axios.get(MOCKAROO_URL);
    const allUsers = response.data;
    let user = allUsers.find(user => user.userId === Number(userId));

    // check if user already exist
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // update user
    user.firstName = firstName;
    user.lastName = lastName;

    res.json({
      message: 'Profile updated successfully!',
      updatedUser: user
    });
  } catch (error) {
    console.error('Error fetching from Mockaroo:', error.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default route;
