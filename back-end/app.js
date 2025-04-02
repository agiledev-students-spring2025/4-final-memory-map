import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import multer from 'multer';
import axios from "axios";
import dotenv from 'dotenv';
import morgan from "morgan";
import cors from 'cors';



dotenv.config({ silent: true });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
//for now!
app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// profiles
import profileRoutes from './routes/friend/profile.js'; 
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/profile', profileRoutes);


let localPins = [];
const deletedPinIds = new Set();
const MOCKAROO_URL = `https://my.api.mockaroo.com/db_pins.json?key=${process.env.MOCKAROO_KEY}`;

//probably should organize this better in the future
//probably pin -> each pin route should be its own file

async function getAllPins() {
  let mockPins = [];
  try {
    const { data } = await axios.get(MOCKAROO_URL);
    mockPins = data;
  } catch (err) {
    console.error('Error fetching from Mockaroo:', err.message);
  }
  const filteredMockPins = mockPins.filter(
    (pin) => !deletedPinIds.has(pin.pinId)
  );
  return [...filteredMockPins, ...localPins];
}

function parsePinDate(pin) {
  try {
    return new Date(pin.createdAt).getTime();
  } catch {
    return 0;
  }
}

//1. public 2. friends 3. private
function canUserViewPin(requestingUserId, pinOwnerId, pinStatus, friendList = []) {
  if (requestingUserId === pinOwnerId) return true;
  if (pinStatus === 1) return true;
  if (pinStatus === 2) {
    return friendList.includes(requestingUserId);
  }
  if (pinStatus === 3) return false;
  return false;
}

app.post('/create_pin', async (req, res) => {
  const newPin = req.body;
  if (!newPin.pinId || !newPin.userId) {
    return res
      .status(400)
      .json({ error: 'pinId and userId are required fields.' });
  }
  const allPins = await getAllPins();
  const existing = allPins.find((pin) => pin.pinId === Number(newPin.pinId));
  if (existing) {
    return res.status(409).json({
      error: 'pin id already exists',
    });
  }
  localPins.push(newPin);
  return res.status(201).json({ message: 'Pin created successfully!', pin: newPin });
});

app.delete('/delete_pin', async (req, res) => {
  const { pinId } = req.query;
  if (!pinId) {
    return res.status(400).json({ error: 'pinId is required.' });
  }
  const pinIdNum = Number(pinId);
  let found = false;
  const localIndex = localPins.findIndex((pin) => pin.pinId === pinIdNum);
  if (localIndex !== -1) {
    localPins.splice(localIndex, 1);
    found = true;
  }
  const mockPins = await axios.get(MOCKAROO_URL).then((r) => r.data);
  const mockPinExists = mockPins.some((pin) => pin.pinId === pinIdNum);
  if (mockPinExists) {
    deletedPinIds.add(pinIdNum);
    found = true;
  }
  if (!found) {
    return res.status(404).json({ error: 'Pin not found.' });
  }
  return res.json({ message: `Pin ${pinId} was deleted (proxied).` });
});

app.get('/query_feed', async (req, res) => {
  const { userId, friends } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required to query feed.' });
  }
  let friendList = [];
  if (friends) {
    friendList = friends.split(',').map((id) => Number(id.trim()));
  }
  const allPins = await getAllPins();
  const visiblePins = allPins.filter((pin) =>
    canUserViewPin(Number(userId), pin.userId, pin.publicStatus, friendList)
  );
  visiblePins.sort((a, b) => parsePinDate(b) - parsePinDate(a));
  const limitedPins = visiblePins.slice(0, 10);
  res.json(limitedPins);
});

app.get('/query_map_pins', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }
  const userIdNum = Number(userId);
  const allPins = await getAllPins();
  const userPins = allPins.filter((pin) => pin.userId === userIdNum);
  res.json(userPins);
});

app.get('/query_single_pin', async (req, res) => {
  const { userId, pinId } = req.query;
  if (!userId || !pinId) {
    return res.status(400).json({
      error: 'both userId and pinId are required.',
    });
  }
  const userIdNum = Number(userId);
  const pinIdNum = Number(pinId);
  const allPins = await getAllPins();
  const pin = allPins.find((p) => p.pinId === pinIdNum && p.userId === userIdNum);
  if (!pin) {
    return res.status(404).json({ error: 'Pin not found.' });
  }
  res.json(pin);
});




export default app;