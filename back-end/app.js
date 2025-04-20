import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import morgan from "morgan";
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config({ silent: true });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import profileRoutes from './routes/friend/profile.js'; 
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/profile', profileRoutes);

import createPinRouter from './routes/pin/createPin.js';
import deletePinRouter from './routes/pin/deletePin.js';
import queryFeedRouter from './routes/pin/queryFeed.js';
import queryMapPinsRouter from './routes/pin/queryMapPins.js';
import deleteFriendRouter from './routes/friend/deleteFriend.js';
import getUserRouter from './routes/friend/getUser.js';
import deleteUserRouter from './routes/friend/deleteUser.js';
import updatePinRouter from './routes/pin/updatePin.js';

import createUserRouter from './routes/friend/createUser.js';
/*
import updateUserRouter from './routes/user/updateUser.js';
*/
import queryFriendsRouter from './routes/friend/queryFriends.js';

app.use(queryMapPinsRouter);
app.use(queryFeedRouter);
app.use(deleteFriendRouter);
app.use(createPinRouter);
app.use(deletePinRouter);
app.use(getUserRouter);
app.use(deleteUserRouter);
app.use(updatePinRouter);


app.use(createUserRouter);
/*
app.use(updateUserRouter);
app.use(getUserRouter);
*/
app.use(queryFriendsRouter);




export default app;
