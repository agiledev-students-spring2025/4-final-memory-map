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
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// profiles
import profileRoutes from './routes/friend/profile.js'; 
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/profile', profileRoutes);


/*
import createPinRouter from './routes/pin/createPin.js';
import deletePinRouter from './routes/pin/deletePin.js';
*/
import queryFeedRouter from './routes/pin/queryFeed.js';
import queryMapPinsRouter from './routes/pin/queryMapPins.js';

//import querySinglePinRouter from './routes/pin/querySinglePin.js';

/*
import createUserRouter from './routes/user/createUser.js';
import deleteUserRouter from './routes/user/deleteUser.js';
import updateUserRouter from './routes/user/updateUser.js';
import getUserRouter from './routes/user/getUser.js';
import queryFriendsRouter from './routes/friends/queryFriends.js';
*/

app.use(queryMapPinsRouter);
app.use(queryFeedRouter);

/*
app.use(createPinRouter);
app.use(deletePinRouter);
app.use(querySinglePinRouter);
*/

/*

app.use(createUserRouter);
app.use(deleteUserRouter);
app.use(updateUserRouter);
app.use(getUserRouter);
app.use(queryFriendsRouter);
*/




export default app;