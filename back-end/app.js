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

const defaultOrigins = ['http://localhost', 'http://localhost:3000'];
const allowedOriginFromEnv = process.env.ALLOWED_ORIGIN;

const allowedOrigins = allowedOriginFromEnv
  ? [...defaultOrigins, allowedOriginFromEnv]
  : defaultOrigins;
  
const corsOptions = {
origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    } else {
    callback(new Error('Not allowed by CORS: ' + origin));
    }
},
credentials: true,
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));

import profileRoutes from './routes/user/profile.js';
import createUserRouter from './routes/user/createUser.js';
import updateUserRouter from './routes/user/updateUser.js';
import getUserRouter from './routes/user/getUser.js';
import deleteUserRouter from './routes/user/deleteUser.js';
import queryAllUserRouter from './routes/user/queryAllUsers.js';

import deleteFriendRouter from './routes/friend/deleteFriend.js';
import queryFriendsRouter from './routes/friend/queryFriends.js';
import sendFriendRequestRouter from './routes/friend/sendFriendRequest.js';
import acceptFriendRequestRouter from './routes/friend/acceptFriendRequest.js';
import rejectFriendRequestRouter from './routes/friend/rejectFriendRequest.js';
import getPendingRequestsRouter from './routes/friend/getPendingRequests.js';

import createPinRouter from './routes/pin/createPin.js';
import deletePinRouter from './routes/pin/deletePin.js';
import queryFeedRouter from './routes/pin/queryFeed.js';
import queryMapPinsRouter from './routes/pin/queryMapPins.js';
import updatePinRouter from './routes/pin/updatePin.js';

app.use('/profile', profileRoutes);
app.use(createUserRouter);
app.use(updateUserRouter);
app.use(getUserRouter);
app.use(deleteUserRouter);
app.use(queryAllUserRouter);

app.use(deleteFriendRouter);
app.use(queryFriendsRouter);
app.use(sendFriendRequestRouter);
app.use(acceptFriendRequestRouter);
app.use(rejectFriendRequestRouter);
app.use(getPendingRequestsRouter);

app.use(createPinRouter);
app.use(deletePinRouter);
app.use(queryFeedRouter);
app.use(queryMapPinsRouter);
app.use(updatePinRouter);

export default app;
